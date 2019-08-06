import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import {format} from 'date-fns';

import filter from './activities-filter';

import './style/activities-widget.scss';

const FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

class ContentDefaultActivity extends React.Component {

  static propTypes = {activity: PropTypes.object};

  constructor(props) {
    super(props);
  }

  presentChange = changes => {
    if (Array.isArray(changes)) {
      if (changes.length === 0) {
        return '[-]';
      }
      return changes.map(change => `[${change.id}:${change.name}]`).join();
    }
    return changes || '-';
  };

  renderContent = activity => (
    <div>
      <p>{`category: ${activity.category.id}`}</p>
      <p>{`issue: ${activity.target.idReadable}`}</p>
      <p>{`timestamp: ${activity.timestamp} (${format(activity.timestamp, FORMAT)})`}</p>
      <p>{`added: ${this.presentChange(activity.added)}`}</p>
      <p>{`removed: ${this.presentChange(activity.removed)}`}</p>
    </div>
  );

  render() {
    const {activity} = this.props;
    const issue = activity.target.issue || activity.target;
    const issueId = issue.idReadable;
    const issueHref = `${filter.youTrackUrl}/issue/${issueId}`;
    return (
      <div key={`activity-${activity.id}`} className="activities-widget__activity">
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
        <div className="activities-widget__activity__author">
          {activity.author.login}
        </div>
        <div className="activities-widget__activity__change">
          {this.renderContent(activity)}
        </div>
      </div>
    );
  }
}


export default ContentDefaultActivity;
