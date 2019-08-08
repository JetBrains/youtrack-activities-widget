import React from 'react';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';

const LOST_EMPTY_VALUE = i18n('[Empty value]');
const REMOVED_FIELD = i18n('[Removed field]');
const SIMPLE_TYPES = [
  'date',
  'date and time',
  'float',
  'integer',
  'period',
  'string'
];

class ContentCustomFieldActivity extends ContentDefaultActivity {

  static getPresenter(field) {
    switch (field.fieldType.valueType) {
      case 'integer':
      case 'string':
      case 'float':
      case 'date':
      case 'date and time':
      case 'period':
        return value => value;
      default:
        return value => value && value.name;
    }
  }

  isSimpleValueField = field => {
    const type = field.fieldType.valueType;
    return SIMPLE_TYPES.indexOf(type) !== -1;
  };

  isMultiValueField = field => field.fieldType.isMultiValue;

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

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const field = activity.field && activity.field.customField;
    const fieldName = field && field.name || REMOVED_FIELD;
    const presentValue = ContentCustomFieldActivity.getPresenter(field);

    let change;
    if (this.isSimpleValueField(field)) {
      change = this.renderSimpleValueChange(activity, presentValue);
    } else if (this.isMultiValueField(field)) {
      change = this.renderMultiValueChange(activity, presentValue);
    } else {
      change = this.renderSingleValueChange(activity, presentValue);
    }

    return (
      <div>
        <span className="activities-widget__activity__change__field-name">
          {`${fieldName}:`}
        </span>
        {change}
      </div>
    );
  };
}


export default ContentCustomFieldActivity;
