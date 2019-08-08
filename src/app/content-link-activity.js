import React from 'react';

import ContentDefaultActivity from './content-default-activity';
import ActivityIssueInfo from './components/activity-issue-info';

import './style/activities-widget.scss';


class ContentLinkActivity extends ContentDefaultActivity {

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = activity.field.presentation;
    return (
      <div className="activities-widget__activity__link">
        <div className="activities-widget__activity__link__field-name">
          {`${fieldName}:`}
        </div>
        <div className="activities-widget__activity__link__value">
          <div>
            {
              activity.removed.map(removedLinkIssue =>
                (
                  <ActivityIssueInfo
                    key={removedLinkIssue.id}
                    issue={removedLinkIssue}
                  />
                )
              )
            }
            {
              activity.added.map(addedLinkIssue =>
                (
                  <ActivityIssueInfo
                    key={addedLinkIssue.id}
                    issue={addedLinkIssue}
                  />
                )
              )
            }
          </div>
        </div>
      </div>
    );
  };
}


export default ContentLinkActivity;
