import React from 'react';
import classNames from 'classnames';
import Link from '@jetbrains/ring-ui/components/link/link';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';
import filter from './activities-filter';


class ContentLinkActivity extends ContentDefaultActivity {

  getValueClassName = link => {
    const valueClass = 'activities-widget__activity__link__change__value';
    const modClass = link.removed ? `${valueClass}_removed` : `${valueClass}_added`;
    return classNames(valueClass, modClass);
  };

  linkToIssue = issue => {
    const issueId = issue.idReadable;
    return `${filter.youTrackUrl}/issue/${issueId}`;
  };

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = activity.field.presentation;
    const links = activity.removed.map(issue => ({issue, removed: true})).
      concat(activity.added.map(issue => ({issue, removed: false})));

    return (
      <div className="activities-widget__activity__link">
        <div className="activities-widget__activity__link__field-name">
          {`${fieldName}:`}
        </div>
        <div className="activities-widget__activity__link__change">
          {
            links.map(link =>
              (
                <Link
                  key={link.issue.id}
                  className={this.getValueClassName(link)}
                  href={this.linkToIssue(link.issue)}
                >
                  {link.issue.idReadable}
                </Link>
              )
            )
          }
        </div>
      </div>
    );
  };
}


export default ContentLinkActivity;
