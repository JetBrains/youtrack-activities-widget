import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import {UserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';

import filter from './../activities-filter';

import '../style/activities-widget.scss';


class ActivityAuthorLink extends React.Component {

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


  render() {
    const {activity} = this.props;
    const author = this.props.user || activity.author;
    const cardUser = this.toCardUser(author);

    return (
      <span className="activities-widget__author-link">
        <UserCardTooltip
          user={cardUser}
        >
          <Link
            className="activities-widget__author-link__name"
            href={cardUser.href}
          >
            {author.fullName}
          </Link>
        </UserCardTooltip>
      </span>
    );
  }
}


export default ActivityAuthorLink;
