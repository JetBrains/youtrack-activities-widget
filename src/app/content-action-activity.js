import React from 'react';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';


class ContentActionActivity extends ContentDefaultActivity {

  getActionName = activity => {
    switch (activity.category.id) {
      case 'IssueCreatedCategory':
        return i18n('Issue created');
      case 'IssueResolvedCategory':
        return i18n('Issue resolved');
      default:
        throw new Error(`Unexpected category ${activity.category.id}`);
    }
  };

  // eslint-disable-next-line react/display-name
  renderContent = activity => <div>{this.getActionName(activity)}</div>
}


export default ContentActionActivity;
