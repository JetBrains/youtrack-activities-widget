import React from 'react';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';


class ContentTextActivity extends ContentDefaultActivity {


  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = activity.field.presentation;
    return (
      <div className="activities-widget__activity__text">
        <div className="activities-widget__activity__text__field-name">
          {`${fieldName}:`}
        </div>
        <div className="activities-widget__activity__text__value">
          <div className="activities-widget__activity__text__value__added">
            {activity.added}
          </div>
          <div className="activities-widget__activity__text__value__removed">
            {activity.removed}
          </div>
        </div>
      </div>
    );
  }
}


export default ContentTextActivity;
