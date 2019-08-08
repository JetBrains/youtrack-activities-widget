import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';

import filter from '../activities-filter';
import '../style/activities-widget.scss';

class ActivityIssueInfo extends React.Component {

  static propTypes = {
    issue: PropTypes.object,
    className: PropTypes.string
  };

  render() {
    const {issue} = this.props;
    const issueId = issue.idReadable;
    const issueHref = `${filter.youTrackUrl}/issue/${issueId}`;
    return (
      <div className="activities-widget__issue">
        <Link
          className="activities-widget__issue__id"
          href={issueHref}
        >
          {issueId}
        </Link>
        <Link
          key={`issue-summary-${issue.id}`}
          className="activities-widget__issue__summary"
          href={issueHref}
        >
          {issue.summary}
        </Link>
      </div>
    );
  }
}


export default ActivityIssueInfo;
