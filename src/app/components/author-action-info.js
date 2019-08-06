import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
import {UserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import {format} from 'date-fns';

import '../style/activities-widget.scss';

const FORMAT = 'YYYY-MM-DD HH:mm';

class AuthorActionInfo extends React.Component {

  static propTypes = {activity: PropTypes.object};

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
    const cardUser = this.toCardUser(activity.author);
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
            user={cardUser}
          >
            <Link
              className="activities-widget__activity__author_info_name"
              href={cardUser.href}
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
  }
}


export default AuthorActionInfo;
