import React from 'react';
import PropTypes from 'prop-types';

import QueryAssist
  from '@jetbrains/ring-ui/components/query-assist/query-assist';
import {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import Select from '@jetbrains/ring-ui/components/select/select';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import '@jetbrains/ring-ui/components/form/form.scss';

import DebounceDecorator from './debounceDecorator';
import filter from './activities-filter';

import './style/activities-widget.scss';

// eslint-disable-next-line max-len
import {loadPinnedIssueFolders, underlineAndSuggest} from './resources';

const toSelectOption = context => context && {
  key: context.id,
  label: context.name,
  model: context
};

class EditFormQueryToolbar extends React.Component {

  static EVERYTHING_CONTEXT_OPTION = {
    id: '-1',
    label: i18n('Everything')
  };

  static propTypes = {
    dashboardApi: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      availableContexts: null,
      query: filter.query,
      context: toSelectOption(filter.context)
    };
    this.underlineAndSuggestDebouncer = new DebounceDecorator();
  }

  componentDidMount() {
    this.loadAllContexts();
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
      this.state.context
    );

  changeSearchQuery = query => {
    this.setState({query});
    this.props.onChange(this.state.context, this.state.query);
  };

  changeSearchContext = context => {
    this.setState({context});
    this.props.onChange(this.state.context, this.state.query);
  };

  loadAllContexts = async () => {
    this.setState({availableContexts: null});
    const allContexts = await loadPinnedIssueFolders(this.fetchYouTrack, true);
    const availableContexts = (allContexts || []).map(toSelectOption);
    availableContexts.unshift(EditFormQueryToolbar.EVERYTHING_CONTEXT_OPTION);
    this.setState({availableContexts});
  };

  onQueryAssistInputChange = queryAssistModel =>
    this.changeSearchQuery(queryAssistModel.query);

  render() {
    const {availableContexts, query, context} = this.state;

    return (
      <div>
        <Select
          className="activities-widget__search-context"
          type={Select.Type.BUTTON}
          size={InputSize.S}
          data={availableContexts}
          selected={context}
          onSelect={this.changeSearchContext}
          filter
          loading={!availableContexts}
          label={i18n('Everything')}
        />
        <div className="activities-widget__search-query">
          <QueryAssist
            disabled={!availableContexts}
            query={query}
            placeholder={i18n('Type search query')}
            onChange={this.onQueryAssistInputChange}
            dataSource={this.queryAssistDataSource}
          />
        </div>
      </div>
    );
  }
}


export default EditFormQueryToolbar;
