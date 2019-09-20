import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
import {UserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';

import filter from './../activities-filter';

import '../style/activities-widget.scss';


class ActivityAuthorInfo extends React.Component {

  static propTypes = {
    activity: PropTypes.object,
    user: PropTypes.object
  };

  toCardUser = user => ({
    id: user.ringId,
    name: user.fullName,
    login: user.login,
    email: user.email,
    avatarUrl: user.avatarUrl,
    href: `${filter.youTrackUrl}/users/${user.ringId}`
  });

  toAvatarUrl = avatarUrl => {
    if (avatarUrl && avatarUrl.charAt(0) === '/') {
      return filter.youTrackUrl + avatarUrl;
    }
    return avatarUrl;
  };

  render() {
    const {activity} = this.props;
    const author = this.props.user || activity.author;
    const cardUser = this.toCardUser(author);

    return (
      <div className="activities-widget__activity__action__author">
        <div
          className="activities-widget__activity__action__author__avatar"
        >
          <Avatar
            size={Size.Size24}
            url={this.toAvatarUrl(author.avatarUrl)}
          />
          {
            activity.authorGroup && (
              <img
                className="activities-widget__activity__action__author__avatar__group"
                src={activity.authorGroup.icon}
                alt=""
              />
            )
          }
        </div>
        <div className="activities-widget__activity__action__author__info">
          <UserCardTooltip
            user={cardUser}
          >
            <Link
              className="activities-widget__activity__action__author__info__name"
              href={cardUser.href}
            >
              {author.fullName}
            </Link>
          </UserCardTooltip>
        </div>
      </div>
    );
  }
}


export default ActivityAuthorInfo;
