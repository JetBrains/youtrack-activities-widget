import React from 'react';

import {i18n} from 'hub-dashboard-addons/dist/localization';
import {format} from 'date-fns';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';

import AuthorActionInfo from './components/author-action-info';
import ContentCustomFieldActivity from './content-custom-field-activity';


class ContentWorkItemsActivity extends ContentDefaultActivity {

  static FORMAT = 'DD MMM YYYY';

  getComment = workItem => {
    if (workItem.text && workItem.text.length) {
      return (
        <React.Fragment>
          {this.separator()}
          <div
            className="activities-widget__activity__work_item__cell activities-widget__activity__work_item__cell_text"
          >
            {workItem.text}
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <div/>
      );
    }
  };

  // eslint-disable-next-line react/display-name
  separator = () => (
    <span className="activities-widget__activity__work_item__cell activities-widget__activity__work_item__cell_separator">
      {'|'}
    </span>
  );


  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const item = activity.added[0];
    return (
      <div className="activities-widget__activity__work_item__container">
        <div
          className="activities-widget__activity__work_item__cell activities-widget__activity__work_item__cell_date"
        >
          <span>{format(item.date, ContentWorkItemsActivity.FORMAT)}</span>
        </div>
        {this.separator()}
        <div
          className="activities-widget__activity__work_item__cell activities-widget__activity__work_item__cell_duration"
        >
          {/* eslint-disable-next-line max-len */}
          {ContentCustomFieldActivity.getPeriodPresentation(item.duration.minutes)}
        </div>
        {this.separator()}
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
      actionTitle={i18n('added work item at')}
      user={activity.added[0].author}
    />
  );
}


export default ContentWorkItemsActivity;
