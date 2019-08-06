import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
import {UserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import {format} from 'date-fns';

import filter from './activities-filter';
import './style/activities-widget.scss';

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

  renderAuthorInfo = activity => {
    const userHref = `/users/${activity.author.ringId}`;
    return (
      <div className="activities-widget__activity__author">
        <div
          className="activities-widget__activity__author_avatar"
        >
          <Avatar
            size={Size.Size18}
            url={activity.author.avatarUrl}
          />
          {
            activity.authorGroup && (
              <img
                className="activities-widget__activity__author_avatar_group"
                src={activity.authorGroup.icon}
              />
            )
          }
        </div>
        <div className="activities-widget__activity__author_info">
          <UserCardTooltip
            user={activity.author}
          >
            <Link
              className="activities-widget__activity__author_info_name"
              href={userHref}
            >
              {activity.author.fullName}
            </Link>
          </UserCardTooltip>
          <span
            className="activities-widget__activity__author_info_action"
          >
            {i18n('updated')}
          </span>
          <span
            className="activities-widget__activity__author_info_time"
          >
            {format(activity.timestamp, FORMAT)}
          </span>
        </div>
      </div>
    );
  };

  renderIssueInfo = activity => {
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
  };

  render() {
    const {activity} = this.props;
    return (
      <div
        key={`activity-${activity.id}`}
        className="activities-widget__activity"
      >
        {this.renderIssueInfo(activity)}
        {this.renderAuthorInfo(activity)}
        <div className="activities-widget__activity__change">
          {this.renderContent(activity)}
        </div>
      </div>
    );
  }
}


export default ContentDefaultActivity;
