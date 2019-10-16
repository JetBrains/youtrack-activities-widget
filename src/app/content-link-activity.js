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
      <React.Fragment>
        <div className="activities-widget__activity__link">
          {
            addedLinks.length > 0 && (
              <React.Fragment>
                <div className="activities-widget__activity__link__field-name">
                  {`${fieldName}:`}
                </div>
                <div className="activities-widget__activity__link__change">
                  {addedLinks.map(issue => (
                    <IssueLine
                      issue={issue}
                      removed={false}
                      key={`${activity.id}${issue.id}`}
                    />)
                  )}
                </div>
              </React.Fragment>
            )
          }
        </div>
        <div className="activities-widget__activity__link">
          {
            removedLinks.length > 0 && (
              <React.Fragment>
                <div className="activities-widget__activity__link__field-name">
                  <span className="activities-widget__activity__link__field-name_removed">
                    {fieldName}
                  </span>{':'}
                </div>
                <div className="activities-widget__activity__link__change">
                  {removedLinks.map(issue => (
                    <IssueLine
                      issue={issue}
                      key={`${activity.id}${issue.id}`}
                    />)
                  )}
                </div>
              </React.Fragment>
            )
          }
        </div>
      </React.Fragment>
    );
  };
}


export default ContentLinkActivity;
