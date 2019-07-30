import React from 'react';
import PropTypes from 'prop-types';

import QueryAssist from '@jetbrains/ring-ui/components/query-assist/query-assist';
import {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import Select from '@jetbrains/ring-ui/components/select/select';
import LoaderInline from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import HttpErrorHandler from '@jetbrains/hub-widget-ui/dist/http-error-handler';
import '@jetbrains/ring-ui/components/form/form.scss';

import {DatePicker} from '@jetbrains/ring-ui'; // theme css file

import ServiceResource from './components/service-resource';
import DebounceDecorator from './debounceDecorator';
import filter from './activities-filter';

import './style/activities-widget.scss';

// eslint-disable-next-line max-len
import {loadPinnedIssueFolders, queryUsers, underlineAndSuggest} from './resources';

const MIN_YOUTRACK_VERSION = '2019.1';

function toUsers(array) {
  return array.map(it => {
    it.isUser = true;
    return it;
  });
}

const toSelectItem = user => user && {
  key: user.id,
  label: user.name,
  avatar: user.avatarURL,
  model: user
};

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
    this.state = {
      availableYoutracks: [],
      availableAuthors: [toSelectItem(filter.author)],
      request: null
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
    const youTracks = await ServiceResource.getYouTrackServices(
      this.props.dashboardApi.fetchHub, MIN_YOUTRACK_VERSION
    );
    const selected = youTracks.filter(yt => yt.id === youTrackId)[0];
    this.setState({
      availableYoutracks: youTracks,
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
    this.props.syncConfig();
  };

  changeDateRange = range => {
    filter.startDate = range.from;
    filter.endDate = range.to;
    this.props.syncConfig();
  };

  changeAuthor = selected => {
    filter.author = selected.map(it => it.model).filter(it => it.isUser);
    this.props.syncConfig();
  };

  loadAllBackendData = async () => {
    this.setState({allContexts: null, allWorkTypes: []});
    const allContexts = await loadPinnedIssueFolders(this.fetchYouTrack, true);
    this.setState({allContexts});
  };

  onQueryAssistInputChange = queryAssistModel =>
    this.changeSearch(queryAssistModel.query);

  queryUsers = async q => {
    const fetchHub = this.props.dashboardApi.fetchHub;
    const usersData = queryUsers(fetchHub, q);
    this.setState({request: usersData});

    const data = await usersData;

    // only the latest request is relevant
    if (this.state.request === usersData) {
      const users = (data[0].users || []).map(it => {
        if (it.profile && it.profile.avatar && it.profile.avatar.url) {
          it.avatarURL = it.profile.avatar.url;
        } else {
          it.avatarURL = null;
        }
        return it;
      });
      const authors = toUsers(users);
      this.setState({
        availableAuthors: authors.map(toSelectItem),
        request: null
      });
    }
  };

  renderDateRange() {
    return (
      <div>
        {/* eslint-disable-next-line max-len */}
        <DatePicker from={filter.startDate} to={filter.endDate} onChange={this.changeDateRange} range/>
      </div>
    );
  }

  renderAuthor() {
    const selected = toUsers(filter.authors);

    return (
      <div>
        <Select
          className="activities-widget__form-select"
          size={InputSize.S}
          data={this.state.availableAuthors}
          filter={{
            placeholder: 'Search user',
            fn: () => true // disable client filtering
          }}
          onFilter={this.queryUsers}
          selected={toSelectItem(selected)}
          onChange={this.changeAuthor}
          loading={!!this.state.request}
          clear
          label={i18n('All authors')}
        />
      </div>
    );
  }

  renderFilteringSettings() {
    const {
      allContexts,
      errorMessage
    } = this.state;

    const contextOptions = (allContexts || []).map(toSelectItem);
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
            selected={toSelectItem(filter.context)}
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
          this.renderAuthor()
        }
      </div>
    );
  }

  render() {
    const {
      availableYoutracks,
      errorMessage,
      allContexts
    } = this.state;

    const youTrackServiceToSelectItem = it => it && {
      key: it.id,
      label: it.name,
      description: it.homeUrl,
      model: it
    };

    return (
      <div className="activities-widget">
        {
          availableYoutracks.length > 1 &&
          (
            <Select
              size={InputSize.FULL}
              type={Select.Type.BUTTON}
              data={availableYoutracks.map(youTrackServiceToSelectItem)}
              selected={youTrackServiceToSelectItem(filter.youTrackId)}
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
    );
  }
}


export default ActivitiesEditForm;
