/* eslint-disable no-magic-numbers */
import React from 'react';
import {format} from 'date-fns';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';
import AuthorActionInfo from './components/author-action-info';
import CollapsibleBlock from './components/collapsible-block';

const LOST_EMPTY_VALUE = i18n('[Empty value]');
const REMOVED_FIELD = i18n('[Removed field]');
const REMOVED_FIELD_TYPE = {valueType: 'removed'};
const SIMPLE_TYPES = [
  'removed',
  'date',
  'date and time',
  'float',
  'integer',
  'period',
  'string'
];

class ContentCustomFieldActivity extends ContentDefaultActivity {

  // eslint-disable-next-line react/display-name
  static getPeriodPresentation = value => {
    const minutes = Math.floor(value % 60);
    const minutesPresentation = `${Math.floor(minutes / 10) || '0'}${minutes % 10 || '0'}${i18n('m')}`;
    const hours = Math.floor(value / 60);
    const hoursPresentation = hours ? (hours + i18n('h')) : '';
    return (
      <React.Fragment>
        <span className="activities-widget__activity__work_item__period_hours">{hoursPresentation}</span>&nbsp;
        <span className="activities-widget__activity__work_item__period_minutes">{minutesPresentation}</span>
      </React.Fragment>
    );
  };

  // eslint-disable-next-line react/display-name
  static getDatePresentation = value => {
    if (value) {
      return format(value, AuthorActionInfo.FORMAT);
    } else {
      return LOST_EMPTY_VALUE;
    }
  };

  // eslint-disable-next-line complexity
  static getPresenter = fieldType => {
    switch (fieldType.valueType) {
      case 'removed':
      case 'integer':
      case 'string':
      case 'float':
        return value => value;
      case 'date':
      case 'date and time':
        return ContentCustomFieldActivity.getDatePresentation;
      case 'period':
        return ContentCustomFieldActivity.getPeriodPresentation;
      default:
        return value => value && value.name;
    }
  };

  // eslint-disable-next-line max-len
  isSimpleValueField = fieldType => SIMPLE_TYPES.indexOf(fieldType.valueType) >= 0;

  isMultiValueField = fieldType => fieldType.isMultiValue;

  renderMultiValueChange(activity, presentValue) {
    return (
      <span>
        <span
          className="activities-widget__activity__change__added"
        >
          {activity.added.map(presentValue).join(',')}
        </span>
        <span
          className="activities-widget__activity__change__removed"
        >
          {activity.removed.map(presentValue).join(',')}
        </span>
      </span>
    );
  }

  renderSingleValueChange(activity, presentValue) {
    return (
      <span>
        {presentValue(activity.removed[0]) || LOST_EMPTY_VALUE}
        {' \u27F6 '}
        {presentValue(activity.added[0]) || LOST_EMPTY_VALUE}
      </span>
    );
  }

  renderSimpleValueChange(activity, presentValue) {
    return (
      <span>
        {presentValue(activity.removed) || LOST_EMPTY_VALUE}
        {' \u27F6 '}
        {presentValue(activity.added) || LOST_EMPTY_VALUE}
      </span>
    );
  }

  renderTextValueChange(activity) {
    return (
      <CollapsibleBlock>
        <div className="activities-widget__activity__text__value">
          <div className="activities-widget__activity__text__value__added">
            {activity.added}
          </div>
          <div className="activities-widget__activity__text__value__removed">
            {activity.removed}
          </div>
        </div>
      </CollapsibleBlock>
    );
  }


  // eslint-disable-next-line react/display-name,complexity
  renderContent = activity => {
    const field = activity.field && activity.field.customField;
    const fieldName = field && field.name || REMOVED_FIELD;
    const fieldType = field && field.fieldType || REMOVED_FIELD_TYPE;

    // eslint-disable-next-line max-len
    const presentValue = ContentCustomFieldActivity.getPresenter(fieldType);

    let change;
    let isTextField = false;
    if (this.isSimpleValueField(fieldType)) {
      change = this.renderSimpleValueChange(activity, presentValue);
    } else if (this.isMultiValueField(fieldType)) {
      change = this.renderMultiValueChange(activity, presentValue);
    } else if (fieldType.valueType === 'text') {
      isTextField = true;
      change = this.renderTextValueChange(activity);
    } else {
      change = this.renderSingleValueChange(activity, presentValue);
    }

    if (isTextField) {
      return (
        <div className="activities-widget__activity__text">
          <div className="activities-widget__activity__text__field-name">
            {`${fieldName}:`}
          </div>
          {change}
        </div>
      );
    } else {
      return (
        <div>
          <span className="activities-widget__activity__change__field-name">
            {`${fieldName}:`}
          </span>{change}
        </div>
      );
    }
  };
}


export default ContentCustomFieldActivity;
