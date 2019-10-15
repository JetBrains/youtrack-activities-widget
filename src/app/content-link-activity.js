import React from 'react';
import classNames from 'classnames';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';
import IssueLine from './components/issue-line';


class ContentLinkActivity extends ContentDefaultActivity {

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = activity.field.presentation;
    const removedLinks = activity.removed;
    const addedLinks = activity.added;

    const getFieldNameClassName = removed => {
      const baseClassName = 'activities-widget__activity__link__field-name';
      return classNames(
        baseClassName, removed && `${baseClassName}_removed`
      );
    };

    return (
      <div className="activities-widget__activity__link">
        {
          addedLinks.length > 0 && (
            <React.Fragment>
              <div className={getFieldNameClassName(false)}>
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
        {
          removedLinks.length > 0 && (
            <React.Fragment>
              <div className={getFieldNameClassName(true)}>
                {`${fieldName}:`}
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
    );
  };
}


export default ContentLinkActivity;
