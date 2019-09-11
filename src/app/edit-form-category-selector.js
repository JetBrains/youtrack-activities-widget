import React from 'react';

import Table from '@jetbrains/ring-ui/components/table/table';
import Selection from '@jetbrains/ring-ui/components/table/selection';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import filter from './activities-filter';

import './style/activities-widget.scss';

const CATEGORIES = [
  {id: 'IssueCreatedCategory', name: i18n('New issues')},
  {id: 'IssueResolvedCategory', name: i18n('Resolved issues')},
  {id: 'ProjectCategory', name: i18n('Project')},
  {id: 'TagsCategory', name: i18n('Tags')},
  {id: 'SummaryCategory', name: i18n('Summary')},
  {id: 'DescriptionCategory', name: i18n('Description')},
  {id: 'CustomFieldCategory', name: i18n('Custom fields')},
  {id: 'AttachmentsCategory', name: i18n('Attachments')},
  {id: 'LinksCategory', name: i18n('Links')},
  {id: 'CommentsCategory', name: i18n('Comments')},
  {id: 'SprintCategory', name: i18n('Sprints')},
  {id: 'WorkItemCategory', name: i18n('Work items')},
  {id: 'VcsChangeCategory', name: i18n('Vcs changes')}
];

class EditFormCategorySelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: CATEGORIES,
      selection: new Selection({
        data: CATEGORIES,
        selected: this.toSelected(filter.categories)
      })
    };
  }

  toSelected = categories => {
    let selected;
    if (categories) {
      selected = CATEGORIES.filter(it => categories.indexOf(it.id) >= 0);
    } else {
      selected = CATEGORIES;
    }
    return new Set(selected);
  };

  fromSelected = selected => [...selected].map(it => it.id);

  onSelect = newSelection => {
    this.setState({selection: newSelection});
    filter.categories = this.fromSelected(newSelection.getSelected());
  };

  columns = [
    {
      id: 'name',
      title: i18n('Name')
    }
  ];

  render() {
    const {data, selection} = this.state;
    return (
      <div className="activities-widget__category-selector">
        <div className="activities-widget__category-selector__title">
          {i18n('Activity Categories')}
        </div>
        <div className="activities-widget__category-selector__info">
          {i18n('Text about what categories are and other info')}
        </div>
        <Table
          data={data}
          columns={this.columns}
          selection={selection}
          onSelect={this.onSelect}
          selectable
        />
      </div>
    );
  }
}


export default EditFormCategorySelector;
