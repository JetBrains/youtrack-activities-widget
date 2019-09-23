import {Renamed10pxIcon} from '@jetbrains/ring-ui/components/icon';
import React from 'react';

import PropTypes from 'prop-types';

import filter from '../activities-filter';
import '../style/activities-widget.scss';

class ActivityStreamLink extends React.Component {

  static propTypes = {
    issue: PropTypes.object,
    activityId: PropTypes.string
  };

  linkToActivityItem() {
    const {issue, activityId} = this.props;
    const issueHref = `${filter.youTrackUrl}/issue/${issue.idReadable}`;
    return `${issueHref}#focus=streamItem-${activityId}`;
  }

  render() {
    return (
      <div className="activities-widget__activity__action__stream-link">
        <a href={this.linkToActivityItem()}>
          <Renamed10pxIcon
            className="activities-widget__activity__action__stream-link__icon"
          />
        </a>
      </div>
    );
  }
}


export default ActivityStreamLink;