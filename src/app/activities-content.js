import React from 'react';
import PropTypes from 'prop-types';

import LoaderInline from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
import Link from '@jetbrains/ring-ui/components/link/link';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import withTimerHOC from '@jetbrains/hub-widget-ui/dist/timer';
import {format} from 'date-fns';

import './style/activities-widget.scss';

const FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

class ActivitiesContent extends React.Component {

  static propTypes = {
    activities: PropTypes.array,
    isLoading: PropTypes.bool,
    isLoadDataError: PropTypes.bool,
    onEdit: PropTypes.func,
    editable: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  renderNoActivitiesError() {
    return (
      <EmptyWidget
        face={EmptyWidgetFaces.OK}
        message={i18n('No activities found')}
      >
        {
          this.props.editable &&
          (
            <Link
              pseudo
              onClick={this.props.onEdit}
            >
              {i18n('Edit search query')}
            </Link>
          )
        }
      </EmptyWidget>
    );
  }

  renderLoadDataError = () => (
    <EmptyWidget
      face={EmptyWidgetFaces.ERROR}
      message={i18n('Can\'t load information from service.')}
    />
  );

  renderLoader = () => (<LoaderInline/>);

  presentChange = changes => {
    if (Array.isArray(changes)) {
      if (changes.length === 0) {
        return '[-]';
      }
      return changes.map(change => `[${change.id}:${change.name}]`).join();
    }
    return changes || '-';
  };

  renderBody = () => (
    <div className="activities-widget">
      {
        (this.props.activities || []).map(activity => (
          <div key={`activity-${activity.id}`} className="activities-widget__activity">
            <p>{`category: ${activity.category.id}`}</p>
            <p>{`issue: ${activity.target.idReadable}`}</p>
            <p>{`author: ${activity.author.login}`}</p>
            <p>{`timestamp: ${activity.timestamp} (${format(activity.timestamp, FORMAT)})`}</p>
            <p>{`added: ${this.presentChange(activity.added)}`}</p>
            <p>{`removed: ${this.presentChange(activity.removed)}`}</p>
          </div>
        ))
      }
    </div>
  );

  render() {
    const {
      activities,
      isLoading,
      isLoadDataError
    } = this.props;

    if (isLoading) {
      return this.renderLoader();
    }
    if (isLoadDataError) {
      return this.renderLoadDataError();
    }
    if (!activities || !activities.length) {
      return this.renderNoActivitiesError();
    }
    return this.renderBody();
  }
}


export default withTimerHOC(ActivitiesContent);
