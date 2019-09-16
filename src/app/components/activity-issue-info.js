import React from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames';

import Link from '@jetbrains/ring-ui/components/link/link';

import filter from '../activities-filter';

import '../style/activities-widget.scss';

class ActivityIssueInfo extends React.Component {

  static propTypes = {
    issue: PropTypes.object,
    className: PropTypes.string
  };

  linkToIssue() {
    const {issue} = this.props;
    const issueId = issue.idReadable;
    return `${filter.youTrackUrl}/issue/${issueId}`;
  }

  render() {
    const {issue} = this.props;
    const issueId = issue.idReadable;
    const issueHref = this.linkToIssue();

    const getIssueLinkClassName = baseClassName => {
      const resolved = issue.resolved !== undefined && issue.resolved !== null;
      return classNames(
        baseClassName, resolved && `${baseClassName}_resolved`
      );
    };

    return (
      <div className="activities-widget__issue">
        <Link
          className={getIssueLinkClassName('activities-widget__issue__id')}
          href={issueHref}
        >
          {issueId}
        </Link>
        <Link
          key={`issue-summary-${issue.id}`}
          className={getIssueLinkClassName('activities-widget__issue__summary')}
          href={issueHref}
        >
          {issue.summary}
        </Link>
      </div>
    );
  }
}


export default ActivityIssueInfo;
