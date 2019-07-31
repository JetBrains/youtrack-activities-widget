import React from 'react';
import PropTypes from 'prop-types';

import QueryAssist
  from '@jetbrains/ring-ui/components/query-assist/query-assist';
import {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import Select from '@jetbrains/ring-ui/components/select/select';
import LoaderInline
  from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import HttpErrorHandler from '@jetbrains/hub-widget-ui/dist/http-error-handler';
import ConfigurationForm from '@jetbrains/hub-widget-ui/dist/configuration-form';
import '@jetbrains/ring-ui/components/form/form.scss';

import {DatePicker} from '@jetbrains/ring-ui'; // theme css file

import ServiceResource from './components/service-resource';
import DebounceDecorator from './debounceDecorator';
import filter from './activities-filter';

import './style/activities-widget.scss';

// eslint-disable-next-line max-len
import {loadPinnedIssueFolders, underlineAndSuggest} from './resources';
import ActivityAuthorSelector from './activity-author-selector';

const MIN_YOUTRACK_VERSION = '2019.1';

class ActivitiesEditForm extends React.Component {

  static EVERYTHING_CONTEXT_OPTION = {
    id: '-1',
    label: i18n('Everything')
  };

  static propTypes = {
    syncConfig: PropTypes.func,
    cancelConfig: PropTypes.func,
    dashboardApi: PropTypes.object
  };

  constructor(props) {
    super(props);
    const youTrack = filter.youTrackId && {id: filter.youTrackId};

    this.state = {
      availableYouTracks: youTrack ? [youTrack] : [],
      selectedYouTrack: youTrack,
      errorMessage: null
    };
    this.underlineAndSuggestDebouncer = new DebounceDecorator();
  }

  componentDidMount() {
    this.loadYouTrackList();
    this.onAfterYouTrackChanged();
  }

  setFormLoaderEnabled(isLoading) {
    this.setState({isLoading});
  }

  async loadYouTrackList() {
    const {youTrackId} = filter;
    const youtracks = await ServiceResource.getYouTrackServices(
      this.props.dashboardApi.fetchHub, MIN_YOUTRACK_VERSION
    );
    const selected = youtracks.filter(yt => yt.id === youTrackId)[0];
    this.setState({
      availableYouTracks: youtracks,
      selectedYouTrack: selected
    });
  }

  async onAfterYouTrackChanged() {
    this.setFormLoaderEnabled(true);
    try {
      await this.loadAllBackendData();
    } catch (err) {
      this.setState({
        isLoading: false,
        errorMessage: HttpErrorHandler.getMessage(
          err,
          i18n('Selected YouTrack service is not available')
        )
      });
      return;
    }
    this.setFormLoaderEnabled(false);
  }

  changeSearch = search => {
    this.setState({search, errorMessage: ''});
  };

  changeYouTrack = selected => {
    this.setState({
      selectedYouTrack: selected.model,
      errorMessage: ''
    }, () => this.onAfterYouTrackChanged());
  };

  fetchYouTrack = async (url, params) => {
    const {dashboardApi} = this.props;
    return await dashboardApi.fetch(filter.youTrackId, url, params);
  };

  underlineAndSuggest = async (query, caret, folder) =>
    // eslint-disable-next-line max-len
    this.underlineAndSuggestDebouncer.decorate(() => underlineAndSuggest(this.fetchYouTrack, query, caret, folder));

  queryAssistDataSource = async queryAssistModel =>
    await this.underlineAndSuggest(
      queryAssistModel.query, queryAssistModel.caret, this.state.context
    );

  changeSearchContext = selected => {
    filter.context = selected.model;
  };

  changeDateRange = range => {
    filter.startDate = range.from;
    filter.endDate = range.to;
  };

  loadAllBackendData = async () => {
    this.setState({allContexts: null});
    const allContexts = await loadPinnedIssueFolders(this.fetchYouTrack, true);
    this.setState({allContexts});
  };

  onQueryAssistInputChange = queryAssistModel =>
    this.changeSearch(queryAssistModel.query);

  renderDateRange() {
    return (
      <div>
        {/* eslint-disable-next-line max-len */}
        <DatePicker from={filter.startDate} to={filter.endDate} onChange={this.changeDateRange} range/>
      </div>
    );
  }

  renderFilteringSettings() {
    const {
      allContexts,
      errorMessage
    } = this.state;

    const toContextSelectItem = it => it && {
      key: it.id,
      label: it.name,
      model: it
    };

    const contextOptions = (allContexts || []).map(toContextSelectItem);
    contextOptions.unshift(ActivitiesEditForm.EVERYTHING_CONTEXT_OPTION);

    if (errorMessage) {
      return (
        <span>{errorMessage}</span>
      );
    }

    return (
      <div>
        <div>
          <Select
            className="activities-widget__search-context"
            type={Select.Type.BUTTON}
            size={InputSize.S}
            data={contextOptions}
            selected={toContextSelectItem(filter.context)}
            onSelect={this.changeSearchContext}
            filter
            loading={!allContexts}
            label={i18n('Everything')}
          />
          <div className="activities-widget__search-query">
            <QueryAssist
              disabled={this.state.isLoading}
              query={filter.search}
              placeholder={i18n('Type search query')}
              onChange={this.onQueryAssistInputChange}
              dataSource={this.queryAssistDataSource}
            />
          </div>
        </div>
        {
          this.renderDateRange()
        }
        {
          <ActivityAuthorSelector
            dashboardApi={this.props.dashboardApi}
          />
        }
      </div>
    );
  }

  render() {
    const {
      availableYouTracks,
      errorMessage,
      allContexts
    } = this.state;

    const toServiceSelectItem = it => it && {
      key: it.id,
      label: it.name,
      description: it.homeUrl,
      model: it
    };

    return (
      <ConfigurationForm
        warning={errorMessage}
        isInvalid={!!errorMessage}
        isLoading={this.state.isLoading}
        onSave={this.props.syncConfig}
        onCancel={this.props.cancelConfig}
      >
        <div className="activities-widget">
          {
            availableYouTracks.length > 1 &&
            (
              <Select
                size={InputSize.FULL}
                type={Select.Type.BUTTON}
                data={availableYouTracks.map(toServiceSelectItem)}
                selected={toServiceSelectItem(filter.youTrackId)}
                onSelect={this.changeYouTrack}
                filter
                label={i18n('Select YouTrack')}
              />
            )
          }
          <div className="ring-form__group">
            {
              allContexts && this.renderFilteringSettings()
            }
            {
              !allContexts && !errorMessage && <LoaderInline/>
            }
          </div>
        </div>
      </ConfigurationForm>
    );
  }
}


export default ActivitiesEditForm;
