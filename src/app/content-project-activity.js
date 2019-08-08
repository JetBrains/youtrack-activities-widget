import React from 'react';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';


class ContentProjectActivity extends ContentDefaultActivity {

  toIssueId = key => {
    const projectKey = key.project.shortName;
    return `${projectKey}, ${projectKey}-${key.numberInProject}`;
  };

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = i18n('Project');
    return (
      <div>
        <span className="activities-widget__activity__change__field-name">
          {`${fieldName}:`}
        </span>
        <span>
          {this.toIssueId(activity.removed)}
          {' \u27F6 '}
          {this.toIssueId(activity.added)}
        </span>
      </div>
    );
  }
}


export default ContentProjectActivity;
