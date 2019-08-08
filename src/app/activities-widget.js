import React from 'react';
import PropTypes from 'prop-types';

import ConfigurableWidget
  from '@jetbrains/hub-widget-ui/dist/configurable-widget';
import {observer} from 'mobx-react';

import ServiceResource from './components/service-resource';
import ActivitiesEditForm from './activities-edit-form';
import ActivitiesContent from './activities-content';
import {loadActivities} from './resources';
import filter from './activities-filter';

@observer
class ActivitiesWidget extends React.Component {
  static MILLIS_IN_SEC = 1000; // eslint-disable-line no-magic-numbers

  static getDefaultYouTrackService =
    async (dashboardApi, predefinedYouTrack) => {
      if (predefinedYouTrack && predefinedYouTrack.id) {
        return predefinedYouTrack;
      }
      try {
        // TODO: pass min-required version here
        return await ServiceResource.getYouTrackService(
          dashboardApi.fetchHub.bind(dashboardApi)
        );
      } catch (err) {
        return null;
      }
    };

  static propTypes = {
    dashboardApi: PropTypes.object,
    configWrapper: PropTypes.object,
    registerWidgetApi: PropTypes.func,
    editable: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      isConfiguring: false,
      isLoading: false,
      isLoadDataError: false
    };

    registerWidgetApi({
      onConfigure: () => this.setState({
        isConfiguring: true,
        isLoading: false,
        isLoadDataError: false
      }),
      onRefresh: () => this.tryLoadActivities()
    });

    this.initialize(dashboardApi);
  }

  componentDidMount() {
    this.initialize(this.props.dashboardApi);
  }

  initialize = async dashboardApi => {
    await this.props.configWrapper.init();

    const service = await ActivitiesWidget.getDefaultYouTrackService(
      dashboardApi, {
        id: filter.youTrackId,
        homeUrl: filter.youTrackUrl
      }
    );

    if (this.props.configWrapper.isNewConfig()) {
      this.initializeNewWidget(service);
    } else {
      await this.initializeExistingWidget(service);
    }
  };

  async initializeNewWidget(youTrackService) {
    if (youTrackService && youTrackService.id) {
      this.setState({isConfiguring: true});
      filter.youTrackId = youTrackService.id;
      filter.youTrackUrl = youTrackService.homeUrl;
      await filter.sync(this.props);
    }
  }

  async initializeExistingWidget(youTrackService) {
    await filter.restore(this.props);
    if (youTrackService && youTrackService.id) {
      filter.youTrackId = youTrackService.id;
      filter.youTrackUrl = youTrackService.homeUrl;
      await filter.sync(this.props);
      this.setState({isConfiguring: false});
      await this.tryLoadActivities();
    }
  }

  fetchYouTrack = async (url, params) => {
    const {dashboardApi} = this.props;
    return await dashboardApi.fetch(filter.youTrackId, url, params);
  };

  tryLoadActivities = async () => {
    this.setState({isLoading: true});
    try {
      const activities = await loadActivities(
        this.fetchYouTrack,
        {
          author: filter.author,
          query: filter.query,
          categories: filter.categories
        }
      );
      this.setState({activities});
    } catch (error) {
      this.setState({isLoadDataError: true});
    }
    this.setState({isLoading: false});
  };

  editConfiguration = () => {
    this.setState({isConfiguring: true});
  };

  submitConfiguration = async () => {
    await filter.sync(this.props);
    this.setState({isConfiguring: false});
    await this.tryLoadActivities();
  };

  cancelConfiguration = async () => {
    await filter.restore(this.props);
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
  };

  renderConfiguration = () => (
    <ActivitiesEditForm
      title={this.state.title}
      submitConfig={this.submitConfiguration}
      cancelConfig={this.cancelConfiguration}
      dashboardApi={this.props.dashboardApi}
    />
  );

  renderContent = () => (
    <ActivitiesContent
      activities={this.state.activities}
      isLoading={this.state.isLoading}
      isLoadDataError={this.state.isLoadDataError}
      editable={this.props.editable}
      tickPeriod={filter.refreshPeriod * ActivitiesWidget.MILLIS_IN_SEC}
      onTick={this.tryLoadActivities} //TODO use incremental loading
      onEdit={this.editConfiguration}
    />
  );

  render() {
    const {
      isConfiguring,
      isLoading
    } = this.state;

    const widgetTitle = 'YouTrack Activities';
    return (
      <ConfigurableWidget
        isConfiguring={isConfiguring}
        dashboardApi={this.props.dashboardApi}
        widgetTitle={widgetTitle}
        widgetLoader={isLoading}
        Configuration={this.renderConfiguration}
        Content={this.renderContent}
      />
    );
  }
}

export default ActivitiesWidget;
