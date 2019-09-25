import React from 'react';
import PropTypes from 'prop-types';

import {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import Select from '@jetbrains/ring-ui/components/select/select';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import '@jetbrains/ring-ui/components/form/form.scss';

import ServiceResource from './components/service-resource';
import filter from './activities-filter';

import './style/activities-widget.scss';

const MIN_YOUTRACK_VERSION = '2019.1';

class EditFormYoutrackSelector extends React.Component {

  static propTypes = {
    dashboardApi: PropTypes.object
  };

  constructor(props) {
    super(props);
    const youTrack = filter.youTrackId && {
      id: filter.youTrackId,
      homeUrl: filter.youTrackUrl
    };

    this.state = {
      availableYouTracks: youTrack ? [youTrack] : [],
      selectedYouTrack: youTrack,
      isLoading: false,
      errorMessage: null
    };
  }

  componentDidMount() {
    this.loadYouTrackList();
    this.onAfterYouTrackChanged();
  }

  setFormLoaderEnabled(isLoading) {
    this.setState({isLoading});
  }

  async loadYouTrackList() {
    const youtracks = await ServiceResource.getYouTrackServices(
      this.props.dashboardApi.fetchHub, MIN_YOUTRACK_VERSION
    );
    this.setState({
      availableYouTracks: youtracks
    });
  }

  async onAfterYouTrackChanged() {
    this.setFormLoaderEnabled(true);
    if (this.state.selectedYouTrack) {
      filter.youTrackId = this.state.selectedYouTrack.id;
      filter.youTrackUrl = this.state.selectedYouTrack.homeUrl;
    }
    this.setFormLoaderEnabled(false);
  }

  changeYouTrack = selected => {
    this.setState({
      selectedYouTrack: selected.model,
      errorMessage: ''
    }, () => this.onAfterYouTrackChanged());
  };

  render() {
    const {availableYouTracks} = this.state;

    const selectedYouTrack = (availableYouTracks || []).filter(
      youTrack => youTrack.id === filter.youTrackId
    )[0];

    const toSelectOption = service => service && {
      key: service.id,
      label: service.name,
      description: service.homeUrl,
      model: service
    };

    return (
      availableYouTracks.length > 1 &&
      (
        <Select
          size={InputSize.FULL}
          type={Select.Type.BUTTON}
          data={availableYouTracks.map(toSelectOption)}
          selected={toSelectOption(selectedYouTrack)}
          onSelect={this.changeYouTrack}
          filter
          label={i18n('Select YouTrack')}
        />
      )
    );
  }
}


export default EditFormYoutrackSelector;
