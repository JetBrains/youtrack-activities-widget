import React from 'react';
import PropTypes from 'prop-types';

import {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import Select from '@jetbrains/ring-ui/components/select/select';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import '@jetbrains/ring-ui/components/form/form.scss';

import filter from './activities-filter';

import './style/activities-widget.scss';

import {queryUsers} from './resources';


const toSelectOption = user => user && {
  key: user.id,
  label: user.name,
  avatar: user.avatarURL,
  model: user
};

class EditFormUserSelector extends React.Component {

  static propTypes = {
    dashboardApi: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    const selected = toSelectOption(filter.author);
    const options = (selected ? [selected] : []);
    this.state = {
      availableAuthors: options,
      selectedAuthor: selected,
      request: null
    };
  }

  changeAuthor = selected => {
    this.setState({selectedAuthor: selected});
    const newAuthor = selected && selected.model;
    this.props.onChange(newAuthor);
  };

  queryUsers = async q => {
    const fetchHub = this.props.dashboardApi.fetchHub;
    const usersDataRequest = queryUsers(fetchHub, q);
    this.setState({request: usersDataRequest});

    const usersData = await usersDataRequest;

    // only the latest request is relevant
    if (this.state.request === usersDataRequest) {
      const users = (usersData.users || []).map(it => {
        if (it.profile && it.profile.avatar && it.profile.avatar.url) {
          it.avatarURL = it.profile.avatar.url;
        } else {
          it.avatarURL = null;
        }
        return it;
      });
      this.setState({
        availableAuthors: users.map(toSelectOption),
        request: null
      });
    }
  };

  render() {
    return (
      <div>
        <Select
          className="activities-widget__form-select"
          size={InputSize.S}
          multiple={false}
          data={this.state.availableAuthors}
          filter={{
            placeholder: 'Search user',
            fn: () => true // disable client filtering
          }}
          onFilter={this.queryUsers}
          selected={this.state.selectedAuthor}
          onChange={this.changeAuthor}
          loading={!!this.state.request}
          clear
          label={i18n('All authors')}
        />
      </div>
    );
  }
}


export default EditFormUserSelector;
