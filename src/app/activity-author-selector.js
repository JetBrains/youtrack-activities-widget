import React from 'react';
import PropTypes from 'prop-types';

import {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import Select from '@jetbrains/ring-ui/components/select/select';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import '@jetbrains/ring-ui/components/form/form.scss';

import filter from './activities-filter';

import './style/activities-widget.scss';

import {queryUsers} from './resources';


const toUserSelectItem = user => user && {
  key: user.id,
  label: user.name,
  avatar: user.avatarURL,
  model: user
};

class ActivityAuthorSelector extends React.Component {

  static propTypes = {
    dashboardApi: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      availableAuthors: [],
      request: null,
      errorMessage: null
    };
  }

  changeAuthor = selected => {
    filter.author = selected;
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
        availableAuthors: users.map(toUserSelectItem),
        request: null
      });
    }
  };

  renderAuthor() {
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
          selected={toUserSelectItem(filter.author)}
          onChange={this.changeAuthor}
          loading={!!this.state.request}
          clear
          label={i18n('All authors')}
        />
      </div>
    );
  }

  render() {
    const {errorMessage} = this.state;
    return errorMessage
      ? <span>{errorMessage}</span>
      : this.renderAuthor();
  }
}


export default ActivityAuthorSelector;
