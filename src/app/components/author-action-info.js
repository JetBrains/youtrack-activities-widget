import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
import {UserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import {format} from 'date-fns';

import filter from './../activities-filter';

import '../style/activities-widget.scss';

const FORMAT = 'YYYY-MM-DD HH:mm';

class AuthorActionInfo extends React.Component {

  static propTypes = {
    activity: PropTypes.object,
    actionTitle: PropTypes.string,
    user: PropTypes.object,
    timestamp: PropTypes.number
  };

  toCardUser = user => ({
    id: user.ringId,
    name: user.fullName,
    login: user.login,
    email: user.email,
    avatarUrl: user.avatarUrl,
    href: `/users/${user.ringId}`
  });

  render() {
    const {activity} = this.props;
    let {actionTitle} = this.props;
    if (!actionTitle) {
      actionTitle = i18n('updated');
    }
    const author = this.props.user || activity.author;
    const cardUser = this.toCardUser(author);
    const timestamp = this.props.timestamp || activity.timestamp;

    return (
      <div className="activities-widget__activity__author">
        <div
          className="activities-widget__activity__author__avatar"
        >
          <Avatar
            size={Size.Size24}
            url={filter.youTrackUrl + author.avatarUrl}
          />
          {
            activity.authorGroup && (
              <img
                className="activities-widget__activity__author__avatar__group"
                src={activity.authorGroup.icon}
              />
            )
          }
        </div>
        <div className="activities-widget__activity__author__info">
          <UserCardTooltip
            user={cardUser}
          >
            <Link
              className="activities-widget__activity__author__info__name"
              href={cardUser.href}
            >
              {author.fullName}
            </Link>
          </UserCardTooltip>
          <span
            className="activities-widget__activity__author__info__action"
          >
            {actionTitle}
          </span>
          <span
            className="activities-widget__activity__author__info__time"
          >
            {format(timestamp, FORMAT)}
          </span>
        </div>
      </div>
    );
  }
}


export default AuthorActionInfo;
