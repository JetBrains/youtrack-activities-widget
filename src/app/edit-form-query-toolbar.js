import React from 'react';
import PropTypes from 'prop-types';

import QueryAssist
  from '@jetbrains/ring-ui/components/query-assist/query-assist';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import '@jetbrains/ring-ui/components/form/form.scss';

import DebounceDecorator from './debounceDecorator';
import filter from './activities-filter';

import './style/activities-widget.scss';

// eslint-disable-next-line max-len
import {underlineAndSuggest} from './resources';

class EditFormQueryToolbar extends React.Component {

  static propTypes = {
    dashboardApi: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      query: filter.query
    };
    this.underlineAndSuggestDebouncer = new DebounceDecorator();
  }

  fetchYouTrack = async (url, params) => {
    const {dashboardApi} = this.props;
    return await dashboardApi.fetch(filter.youTrackId, url, params);
  };

  underlineAndSuggest = async (query, caret, folder) => {
    // eslint-disable-next-line max-len
    const call = () => underlineAndSuggest(this.fetchYouTrack, query, caret, folder);
    return this.underlineAndSuggestDebouncer.decorate(call);
  };


  queryAssistDataSource = async queryAssistModel =>
    await this.underlineAndSuggest(
      queryAssistModel.query,
      queryAssistModel.caret,
      null
    );

  changeSearchQuery = query => {
    this.setState({query});
    this.props.onChange(this.state.query);
  };

  onQueryAssistInputChange = queryAssistModel =>
    this.changeSearchQuery(queryAssistModel.query);

  render() {
    const {query} = this.state;

    return (
      <div className="activities-widget__issue-filter">
        <div className="activities-widget__issue-filter__query">
          <QueryAssist
            query={query}
            placeholder={i18n('Type search query')}
            onChange={this.onQueryAssistInputChange}
            dataSource={this.queryAssistDataSource}
          />
        </div>
        <div className="ring-form__control__description">
          {i18n('Only activities from the issues matching the search query get to the result.')}
        </div>
      </div>
    );
  }
}


export default EditFormQueryToolbar;
