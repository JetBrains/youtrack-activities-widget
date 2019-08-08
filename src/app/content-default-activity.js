import React from 'react';
import PropTypes from 'prop-types';

import {format} from 'date-fns';

import AuthorActionInfo from './components/author-action-info';
import ActivityIssueInfo from './components/activity-issue-info';

const FORMAT = 'YYYY-MM-DD HH:mm';

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
      <p>{`timestamp: ${activity.timestamp} (${format(activity.timestamp, FORMAT)})`}</p>
      <p>{`added: ${this.presentChange(activity.added)}`}</p>
      <p>{`removed: ${this.presentChange(activity.removed)}`}</p>
    </div>
  );

  render() {
    const {activity} = this.props;
    return (
      <div
        key={`activity-${activity.id}`}
        className="activities-widget__activity"
      >
        <div className="activities-widget__activity__issue">
          <ActivityIssueInfo
            issue={activity.target.issue || activity.target}
          />
        </div>
        <AuthorActionInfo activity={activity}/>
        <div className="activities-widget__activity__change">
          {this.renderContent(activity)}
        </div>
      </div>
    );
  }
}


export default ContentDefaultActivity;
