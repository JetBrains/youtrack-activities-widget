import React from 'react';
import PropTypes from 'prop-types';

import LoaderInline
  from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
import ConfigurationForm from '@jetbrains/hub-widget-ui/dist/configuration-form';
import RefreshPeriod from '@jetbrains/hub-widget-ui/dist/refresh-period';
import {DatePicker} from '@jetbrains/ring-ui'; // theme css file
import '@jetbrains/ring-ui/components/form/form.scss';
import {observer} from 'mobx-react';

import filter from './activities-filter';
import EditFormUserSelector from './edit-form-user-selector';
import EditFormQueryToolbar from './edit-form-query-toolbar';
import EditFormYoutrackSelector from './edit-form-youtrack-selector';

import './style/activities-widget.scss';

@observer
class ActivitiesEditForm extends React.Component {

  static propTypes = {
    submitConfig: PropTypes.func,
    cancelConfig: PropTypes.func,
    dashboardApi: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errorMessage: null
    };
  }

  changeDate = moment => {
    filter.date = moment.toDate();
  };

  changeIssueQuery = query => {
    filter.query = query;
  };

  changAuthor = author => {
    filter.author = author;
  };

  changeRefreshPeriod = period => {
    filter.refreshPeriod = period;
  };

  renderFilteringSettings() {
    return (
      <div className="ring-form__group">
        <div>
          <EditFormQueryToolbar
            dashboardApi={this.props.dashboardApi}
            onChange={this.changeIssueQuery}
          />
          <EditFormUserSelector
            dashboardApi={this.props.dashboardApi}
            onChange={this.changAuthor}
          />
          <DatePicker
            className="activities-widget__date-picker"
            date={filter.date}
            onChange={this.changeDate}
            clear
          />
        </div>
      </div>
    );
  }

  renderRefreshPeriod() {
    const {isLoading, errorMessage} = this.state;

    if (isLoading || errorMessage) {
      return '';
    }

    return (
      <RefreshPeriod
        seconds={filter.refreshPeriod}
        onChange={this.changeRefreshPeriod}
      />
    );
  }

  render() {
    const {isLoading, errorMessage} = this.state;

    return (
      <ConfigurationForm
        warning={errorMessage}
        isInvalid={!!errorMessage}
        isLoading={isLoading}
        panelControls={this.renderRefreshPeriod()}
        onSave={this.props.submitConfig}
        onCancel={this.props.cancelConfig}
      >
        <div className="activities-widget">
          {
            <EditFormYoutrackSelector
              dashboardApi={this.props.dashboardApi}
            />
          }
          {
            // eslint-disable-next-line no-nested-ternary
            errorMessage
              ? <span>{errorMessage}</span>
              : isLoading
                ? <LoaderInline/>
                : (this.renderFilteringSettings())
          }
        </div>
      </ConfigurationForm>
    );
  }
}


export default ActivitiesEditForm;
