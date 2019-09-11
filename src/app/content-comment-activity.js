import React from 'react';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';


class ContentCommentActivity extends ContentDefaultActivity {

  // eslint-disable-next-line react/display-name
  renderContent = activity => (
    <div>
      {activity.added[0].text}
    </div>
  );

  canBeOpenInIssueStream = () => true;
}


export default ContentCommentActivity;
