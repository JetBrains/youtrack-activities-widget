import React from 'react';
import PropTypes from 'prop-types';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import fecha from 'fecha';
import {
  ChevronDownIcon, ChevronRightIcon
} from '@jetbrains/ring-ui/components/icon';

import filter from '../activities-filter';
import {loadIssue} from '../resources';

import IssueLink from './issue-link';

class IssueCard extends React.Component {

  static fieldColorToCss(color) {
    return {
      background: color.background,
      color: color.foreground
    };
  }

  static getValuableIssueFields(issue) {
    return (issue.fields || []).filter(
      field => IssueCard.toArray(field.value || []).length > 0
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

  static getValuePresentation(issueField, dateFormats) {
    const field = issueField.projectCustomField &&
      issueField.projectCustomField.field;
    const fieldType = (field && field.fieldType && field.fieldType.valueType) ||
      '';
    return IssueCard.toArray(issueField.value || []).map(value => {
      if (fieldType.indexOf('date') > -1) {
        return IssueCard.getDatePresentation(
          value, dateFormats, fieldType.indexOf('time') > -1
        );
      }
      return IssueCard.getName(value) || value.presentation ||
        value.minutes || value.name || value.login || value;
    }).join(', ');
  }

  static toArray = value => (Array.isArray(value) ? value : [value]);

  static getFirstLetter = value =>
    (IssueCard.getName(value) || 'c')[0].toUpperCase();

  static isColoredValue = value => value.color && value.color.id > 0;

  static getColoredSquareModel(issue) {

    const makeColorFieldPresentationObject = issueField => {
      const coloredValue = IssueCard.toArray(issueField.value).filter(
        IssueCard.isColoredValue
      )[0];
      if (!coloredValue) {
        return null;
      }
      const fieldName = IssueCard.getName(
        issueField.projectCustomField.field || {}
      );
      return {
        style: IssueCard.fieldColorToCss(coloredValue.color),
        letter: IssueCard.getFirstLetter(coloredValue),
        title: `${fieldName}: ${IssueCard.getName(coloredValue)}`,
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
        IssueCard.toArray(field.value || []).some(IssueCard.isColoredValue)
    )[0];
    if (!fieldWithColoredValues) {
      return null;
    }
    return makeColorFieldPresentationObject(fieldWithColoredValues);
  }

  static onOpenIssue = evt => evt.stopPropagation();

  static propTypes = {
    issue: PropTypes.object,
    removed: PropTypes.bool,
    homeUrl: PropTypes.string,
    dateFormats: PropTypes.object,
    showMore: PropTypes.bool
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
      coloredSquare: null, //IssueCard.getColoredSquareModel(issue),
      valuableFields: null //IssueCard.getValuableIssueFields(issue)
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
  //     coloredSquare: IssueCard.getColoredSquareModel(issue),
  //     valuableFields: IssueCard.getValuableIssueFields(issue)
  //   };
  // }

  linkToIssue = issue => {
    const issueId = issue.idReadable;
    return `${filter.youTrackUrl}/issue/${issueId}`;
  };

  renderFieldValue(issueField) {
    const firstValue = IssueCard.toArray(issueField.value)[0];

    return (
      <div className="issue-card-panel__field-value">
        {IssueCard.getValuePresentation(issueField, this.props.dateFormats)}
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
          IssueCard.isColoredValue(firstValue) &&
          (
            <span
              className="issue-card-panel__field-color issue-card-panel__colored-field"
              style={IssueCard.fieldColorToCss(firstValue.color)}
            >
              {IssueCard.getFirstLetter(firstValue)}
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
                  {IssueCard.getName(issueField.projectCustomField.field)}
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
          valuableFields: IssueCard.getValuableIssueFields(issue)
        }
      );
    }
  };

  closeFields = async () => {
    this.setState({expanded: false});
  };

  getOnClick(expanded) {
    return expanded ? this.closeFields : this.getFieldsAndExpand;
  }

  renderChevron(expanded, color) {
    return expanded ? (
      <ChevronDownIcon
        size={ChevronDownIcon.Size.Size14}
        color={color}
        onClick={this.getOnClick(expanded)}
      />
    ) : (
      <ChevronRightIcon
        size={ChevronRightIcon.Size.Size14}
        color={color}
        onClick={this.getOnClick(expanded)}
      />
    );
  }

  render() {
    const {
      issue,
      valuableFields,
      expanded
    } = this.state;

    const {showMore} = this.props;

    return (
      <div className="activities-widget__issue-card">
        <div
          className="activities-widget__issue-card__header"
          key={issue.id}
        >
          {
            !showMore && (
              <React.Fragment>
                <div className="activities-widget__issue-card__header__toggle">
                  <span className="issue-card-panel__issue-toggle">
                    {this.renderChevron(expanded, ChevronDownIcon.Color.GRAY)}
                  </span>
                </div>
                <div className="activities-widget__issue-card__header__link">
                  <IssueLink issue={issue}/>
                </div>
              </React.Fragment>
            )
          }
          {
            showMore && (
              <div className="activities-widget__issue-card__header__toggle">
                <a
                  className="issue-card-panel__issue-toggle"
                  onClick={this.getOnClick(expanded)}
                >
                  {this.renderChevron(expanded, ChevronDownIcon.Color.BLUE)}
                  <span className="issue-card-panel__issue-toggle__text">
                    {i18n('Show more')}
                  </span>
                </a>
              </div>
            )
          }
        </div>
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
    );
  }
}

export default IssueCard;
