import React from 'react';
import PropTypes from 'prop-types';

import {format} from 'date-fns';

import '../style/activities-widget.scss';


class ActivityActionInfo extends React.Component {

  static FORMAT = 'YYYY-MM-DD HH:mm';

  static propTypes = {
    activity: PropTypes.object,
    actionTitle: PropTypes.string
  };

  render() {
    const {activity, actionTitle} = this.props;
    const timestamp = activity.timestamp;

    return (
      <React.Fragment>
        <span
          className="activities-widget__activity__action__title"
        >
          {actionTitle}
        </span>
        <span
          className="activities-widget__activity__action__time"
        >
          {format(timestamp, ActivityActionInfo.FORMAT)}
        </span>
      </React.Fragment>
    );
  }
}


export default ActivityActionInfo;
