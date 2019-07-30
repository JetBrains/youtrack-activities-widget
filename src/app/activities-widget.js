import React from 'react';
import PropTypes from 'prop-types';

import ConfigurableWidget
  from '@jetbrains/hub-widget-ui/dist/configurable-widget';

import ServiceResource from './components/service-resource';
import ActivitiesEditForm from './activities-edit-form';
import ActivitiesContent from './activities-content';
import {loadActivities} from './resources';
import filter from './activities-filter';

class ActivitiesWidget extends React.Component {
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
        isLoading: false
      }),
      onRefresh: () => this.loadActivitiesWithError()
    });

    this.initialize(dashboardApi);
  }

  componentDidMount() {
    this.initialize(this.props.dashboardApi);
  }

  initialize = async dashboardApi => {
    await this.props.configWrapper.init();

    const youTrackService = await ActivitiesWidget.getDefaultYouTrackService(
      dashboardApi, {
        id: filter.youTrackId
      }
    );

    if (this.props.configWrapper.isNewConfig()) {
      this.initializeNewWidget(youTrackService);
    } else {
      await this.initializeExistingWidget(youTrackService);
    }
  };

  async initializeNewWidget(youTrackService) {
    if (youTrackService && youTrackService.id) {
      this.setState({isConfiguring: true});
      filter.youTrackId = youTrackService.id;
      await filter.sync(this.props);
    }
  }

  async initializeExistingWidget(youTrackService) {
    await filter.restore(this.props);
    if (youTrackService && youTrackService.id) {
      filter.youTrackId = youTrackService.id;
      await filter.sync(this.props);
      this.setState({isConfiguring: false});
    }
  }

  loadActivitiesWithError = async (search, context) => {
    try {
      await loadActivities(search, context);
    } catch (error) {
      this.setState({isLoadDataError: true});
    }
  };

  editConfiguration = () => {
    this.setState({isConfiguring: true});
  };

  syncConfiguration = async () => {
    await filter.sync(this.props);
    this.setState({isConfiguring: false});
  };

  cancelConfiguration = async () => {
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize(this.props.dashboardApi);
  };

  renderConfiguration = () => (
    <ActivitiesEditForm
      title={this.state.title}
      syncConfig={this.syncConfiguration}
      cancelConfig={this.cancelConfiguration}
      dashboardApi={this.props.dashboardApi}
    />
  );

  renderContent = () => (
    <ActivitiesContent
      youTrack={this.state.youTrack}
      activities={this.state.activities}
      isLoading={this.state.isLoading}
      isLoadDataError={this.state.isLoadDataError}
      editable={this.props.editable}
      onEdit={this.editConfiguration}
    />
  );

  render() {
    const {
      isConfiguring,
      isLoading
    } = this.state;

    const widgetTitle = 'Activities'; //TODO
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
