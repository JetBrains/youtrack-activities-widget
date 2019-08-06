import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';

import filter from '../activities-filter';
import '../style/activities-widget.scss';

class ActivityIssueInfo extends React.Component {

  static propTypes = {activity: PropTypes.object};

  render() {
    const {activity} = this.props;
    const issue = activity.target.issue || activity.target;
    const issueId = issue.idReadable;
    const issueHref = `${filter.youTrackUrl}/issue/${issueId}`;
    return (
      <div className="activities-widget__activity__issue">
        <Link
          className="activities-widget__activity__issue__id"
          href={issueHref}
        >
          {issueId}
        </Link>
        <Link
          key={`issue-summary-${issue.id}`}
          className="activities-widget__activity__issue__summary"
          href={issueHref}
        >
          {issue.summary}
        </Link>
      </div>
    );
  }
}


export default ActivityIssueInfo;
