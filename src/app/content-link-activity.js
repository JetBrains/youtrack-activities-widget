import React from 'react';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';
import IssueLine from './components/issue-line';


class ContentLinkActivity extends ContentDefaultActivity {

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = activity.field.presentation;
    const removedLinks = activity.removed;
    const addedLinks = activity.added;

    return (
      <div className="activities-widget__activity__link">
        {
          addedLinks.length > 0 && (
            <div className="activities-widget__activity__link__field-name">
              {`${fieldName}:`}
            </div>
          )
        }
        {
          addedLinks.length > 0 && (
            <div className="activities-widget__activity__link__change">
              {addedLinks.map(issue => (
                <IssueLine
                  issue={issue}
                  removed={false}
                  key={`${activity.id}${issue.id}`}
                />)
              )}
            </div>
          )
        }
        {
          removedLinks.length > 0 && (
            <div
              className="activities-widget__activity__link__field-name activities-widget__activity__link__field-removed"
            >
              {`${fieldName}:`}
            </div>
          )
        }
        {
          removedLinks.length > 0 && (
            <div className="activities-widget__activity__link__change">
              {removedLinks.map(issue => (
                <IssueLine
                  issue={issue}
                  key={`${activity.id}${issue.id}`}
                />)
              )}
            </div>
          )
        }
      </div>
    );
  };
}


export default ContentLinkActivity;
