import React from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames';

import Link from '@jetbrains/ring-ui/components/link/link';

import filter from '../activities-filter';

import '../style/activities-widget.scss';

class IssueLink extends React.Component {

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

    const getLinkClassName = isSummary => {
      const valueClass = isSummary
        ? 'activities-widget__issue__summary'
        : 'activities-widget__issue__id';
      const resolved = issue.resolved !== undefined && issue.resolved !== null;
      const modClass = resolved
        ? `${valueClass}_resolved`
        : `${valueClass}`;

      return classNames(valueClass, modClass);
    };

    return (
      <Link
        href={this.linkToIssue(issue)}
        className="activities-widget__issue"
      >
        <span className={getLinkClassName(false)}>
          {issue.idReadable}
        </span>
        <span className={getLinkClassName(true)}>
          {issue.summary}
        </span>
      </Link>
    );
  }
}


export default IssueLink;
