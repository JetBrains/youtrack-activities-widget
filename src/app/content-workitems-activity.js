import React from 'react';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';

import AuthorActionInfo from './components/author-action-info';


class ContentWorkItemsActivity extends ContentDefaultActivity {


  getComment = workItem => {
    if (workItem.text && workItem.text.length) {
      return (
        <React.Fragment>
          <span className="activities-widget__activity__work_item__separator">
            {'|'}
          </span>
          <div
            className="activities-widget__activity__work_item__cell activities-widget__activity__work_item__cell_text"
          >
            {workItem.text}
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <div style={{width: '100%'}}/>
      );
    }
  };


  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const item = activity.added[0];
    return (
      <div className="activities-widget__activity__work_item__container">
        <div
          className="activities-widget__activity__work_item__cell activities-widget__activity__work_item__cell_duration"
        >
          {item.duration.presentation}
        </div>
        <span className="activities-widget__activity__work_item__separator">
          {'|'}
        </span>
        <div
          className="activities-widget__activity__work_item__cell activities-widget__activity__work_item__cell_type"
          title={item.type && item.type.name}
        >
          {(item.type && item.type.name) || i18n('No type')}
        </div>
        {this.getComment(item)}
      </div>
    );
  };

  // eslint-disable-next-line react/display-name
  authorInfo = activity => (
    <AuthorActionInfo
      activity={activity}
      actionTitle={i18n('added work item on')}
      user={activity.added[0].author}
      timestamp={activity.added[0].date}
    />
  );
}


export default ContentWorkItemsActivity;
