import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {format} from 'date-fns';

import AuthorActionInfo from './components/author-action-info';
import ActivityIssueInfo from './components/activity-issue-info';

const FORMAT = 'YYYY-MM-DD HH:mm';
const HIGHLIGHT_TIMEOUT = 5000;

class ContentDefaultActivity extends React.Component {

  static propTypes = {
    activity: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      new: props.activity.new
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({new: null}), HIGHLIGHT_TIMEOUT);
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

  authorInfo = activity => (
    <AuthorActionInfo activity={activity}/>
  );

  render() {
    const {activity} = this.props;
    const getActivityClassName = () => classNames(
      'activities-widget__activity',
      this.state.new && 'activities-widget__activity_new'
    );
    return (
      <div
        key={`activity-${activity.id}`}
        className={getActivityClassName()}
      >
        <div className="activities-widget__activity__issue">
          <ActivityIssueInfo
            issue={activity.target.issue || activity.target}
          />
        </div>
        {this.authorInfo(activity)}
        <div className="activities-widget__activity__change">
          {this.renderContent(activity)}
        </div>
      </div>
    );
  }
}


export default ContentDefaultActivity;
