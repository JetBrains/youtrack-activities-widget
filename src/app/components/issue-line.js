import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import fecha from 'fecha';
import Link from '@jetbrains/ring-ui/components/link/link';
import {
  ChevronDownIcon,
  ChevronUpIcon
} from '@jetbrains/ring-ui/components/icon';

import filter from '../activities-filter';
import {loadIssue} from '../resources';

class IssueLine extends React.Component {

  static fieldColorToCss(color) {
    return {
      background: color.background,
      color: color.foreground
    };
  }

  static getValuableIssueFields(issue) {
    return (issue.fields || []).filter(
      field => IssueLine.toArray(field.value || []).length > 0
    ).filter(
      field => {
        const valueType = field.projectCustomField &&
          field.projectCustomField.field &&
          field.projectCustomField.field.fieldType &&
          field.projectCustomField.field.fieldType.valueType;
        return valueType !== 'text';
      }
    );
  }

  static getName(field) {
    return field.localizedName || field.name;
  }

  static getDatePresentation(timestamp, dateFormats, withTime) {
    return fecha.format(
      timestamp,
      withTime ? dateFormats.dateTimePattern : dateFormats.datePattern
    );
  }

  static getValuePresentation(issueField, dateFromats) {
    const field = issueField.projectCustomField &&
      issueField.projectCustomField.field;
    const fieldType = (field && field.fieldType && field.fieldType.valueType) ||
      '';
    return IssueLine.toArray(issueField.value || []).map(value => {
      if (fieldType.indexOf('date') > -1) {
        return IssueLine.getDatePresentation(
          value, dateFromats, fieldType.indexOf('time') > -1
        );
      }
      return IssueLine.getName(value) || value.presentation ||
        value.minutes || value.name || value.login || value;
    }).join(', ');
  }

  static toArray = value =>
    (Array.isArray(value) ? value : [value]);

  static getFirstLetter = value =>
    (IssueLine.getName(value) || 'c')[0].toUpperCase();

  static isColoredValue = value =>
    value.color && value.color.id > 0;

  static getColoredSquareModel(issue) {

    const makeColorFieldPresentationObject = issueField => {
      const coloredValue = IssueLine.toArray(issueField.value).filter(
        IssueLine.isColoredValue
      )[0];
      if (!coloredValue) {
        return null;
      }
      const fieldName = IssueLine.getName(
        issueField.projectCustomField.field || {}
      );
      return {
        style: IssueLine.fieldColorToCss(coloredValue.color),
        letter: IssueLine.getFirstLetter(coloredValue),
        title: `${fieldName}: ${IssueLine.getName(coloredValue)}`,
        issueField
      };
    };

    const bundleFields = (issue.fields || []).filter(
      issueField => !!issueField.projectCustomField.bundle
    );
    const priorityField = bundleFields.filter(
      issueField => {
        const field = issueField.projectCustomField.field || {};
        return (field.name || '').toLowerCase() === 'priority';
      }
    )[0];
    if (priorityField) {
      if (priorityField.value) {
        return makeColorFieldPresentationObject(priorityField);
      }
      return null;
    }
    const fieldWithColoredValues = (issue.fields || []).filter(
      field =>
        IssueLine.toArray(field.value || []).some(IssueLine.isColoredValue)
    )[0];
    if (!fieldWithColoredValues) {
      return null;
    }
    return makeColorFieldPresentationObject(fieldWithColoredValues);
  }

  static onOpenIssue = evt =>
    evt.stopPropagation();

  static propTypes = {
    issue: PropTypes.object,
    removed: PropTypes.bool,
    homeUrl: PropTypes.string,
    dateFormats: PropTypes.object
  };

  static defaultProps = {
    dateFormats: {
      datePattern: 'YYYY-MM-DD',
      dateTimePattern: 'YYYY-MM-DD\'T\'HH:mm:ss'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      issue: this.props.issue,
      coloredSquare: null, //IssueLine.getColoredSquareModel(issue),
      valuableFields: null //IssueLine.getValuableIssueFields(issue)
    };
    this.getFieldsAndExpand = this.getFieldsAndExpand.bind(this);
  }

  fetchYouTrack = async (url, params) => {
    const {dashboardApi, youTrackId} = filter;
    return await dashboardApi.fetch(youTrackId, url, params);
  };

  // static getDerivedStateFromProps(props) {
  //   const {issue, expanded} = props;
  //   return {
  //     issue,
  //     expanded,
  //     coloredSquare: IssueLine.getColoredSquareModel(issue),
  //     valuableFields: IssueLine.getValuableIssueFields(issue)
  //   };
  // }


  getValueClassName = (link, isSummary) => {
    const valueClass = 'activities-widget__activity__link__change__value';
    const modClass = link.removed ? `${valueClass}_removed` : `${valueClass}_added`;
    if (!isSummary) {
      return classNames(valueClass, modClass, 'activities-widget__issue__id');
    }
    return classNames(valueClass, modClass);
  };

  linkToIssue = issue => {
    const issueId = issue.idReadable;
    return `${filter.youTrackUrl}/issue/${issueId}`;
  };

  renderFieldValue(issueField) {
    const firstValue = IssueLine.toArray(issueField.value)[0];

    return (
      <div className="issue-card-panel__field-value">
        {IssueLine.getValuePresentation(issueField, this.props.dateFormats)}
        {
          firstValue.avatarUrl &&
          (
            <img
              className="issue-card-panel__field-avatar"
              src={firstValue.avatarUrl}
            />
          )
        }
        {
          IssueLine.isColoredValue(firstValue) &&
          (
            <span
              className="issue-card-panel__field-color issue-card-panel__colored-field"
              style={IssueLine.fieldColorToCss(firstValue.color)}
            >
              {IssueLine.getFirstLetter(firstValue)}
            </span>
          )
        }
      </div>
    );
  }

  renderFields(issueFields, fixed) {
    const fixClassName = fixed ? 'issue-card-panel__fields-fix' : '';
    return (
      <div className={`issue-card-panel__fields ${fixClassName}`}>
        {
          issueFields.map(issueField => (
            <div
              key={`field-line-${issueField.id}`}
              className="issue-card-panel__field-row"
            >
              <div className="issue-card-panel__field">
                <div className="issue-card-panel__field-title">
                  {IssueLine.getName(issueField.projectCustomField.field)}
                </div>
                {this.renderFieldValue(issueField)}
              </div>
            </div>
          ))
        }
      </div>
    );
  }

  getFieldsAndExpand = async () => {
    const initialIssue = this.props.issue;
    if (this.state.valuableFields && this.state.valuableFields.length) {
      this.setState({expanded: true});
    } else {
      const issue = await loadIssue(this.fetchYouTrack, initialIssue.id);
      this.setState(
        {
          issue,
          expanded: true,
          valuableFields: IssueLine.getValuableIssueFields(issue)
        }
      );
    }
  };

  closeFields = async () => {
    this.setState({expanded: false});
  };

  render() {
    const {
      issue,
      valuableFields,
      expanded
    } = this.state;

    return (
      <div>
        <div
          className="activities-widget__activity__link__change__item"
          key={issue.id}
        >
          <div className="activities-widget__activity__link__change__id-summary">
            <Link
              href={this.linkToIssue(issue)}
              className={this.getValueClassName(issue, true)}
            >
              <span
                className={this.getValueClassName(issue, false)}
              >
                {issue.idReadable}
              </span>
              <span className="activities-widget__issue__summary_text">
                {issue.summary}
              </span>
            </Link>
          </div>
          <span className="issue-card-panel__issue-toggler">
            {
              expanded
                ? (
                  <ChevronUpIcon
                    size={ChevronUpIcon.Size.Size14}
                    color={ChevronUpIcon.Color.GRAY}
                    onClick={this.closeFields}
                  />
                )
                : (
                  <ChevronDownIcon
                    size={ChevronDownIcon.Size.Size14}
                    color={ChevronDownIcon.Color.GRAY}
                    onClick={this.getFieldsAndExpand}
                  />
                )
            }
          </span>
          {
            expanded &&
            (
              <div
                className="issue-card-panel__issue-expanded-block"
                data-test="issue-line-expanded-block"
              >
                {this.renderFields(valuableFields)}
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default IssueLine;
