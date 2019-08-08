import React from 'react';

import Table from '@jetbrains/ring-ui/components/table/table';
import Selection from '@jetbrains/ring-ui/components/table/selection';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import filter from './activities-filter';

import './style/activities-widget.scss';

const CATEGORIES = [
  {id: 'IssueCreatedCategory', name: i18n('New issues')},
  {id: 'IssueResolvedCategory', name: i18n('Resolved issues')},
  {id: 'AttachmentsCategory', name: i18n('Attachments')},
  {id: 'DescriptionCategory', name: i18n('Description')},
  {id: 'CommentsCategory', name: i18n('Comments')},
  {id: 'CustomFieldCategory', name: i18n('Custom fields')},
  {id: 'LinksCategory', name: i18n('Links')},
  {id: 'ProjectCategory', name: i18n('Project')},
  {id: 'SprintCategory', name: i18n('Sprints')},
  {id: 'SummaryCategory', name: i18n('Summary')},
  {id: 'TagsCategory', name: i18n('Tags')},
  {id: 'IssueVisibilityCategory', name: i18n('Visibility')},
  {id: 'VcsChangeCategory', name: i18n('Vcs changes')},
  {id: 'WorkItemCategory', name: i18n('Work items')}
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

  fromSelected = selected => {
    const categories = [...selected].map(it => it.id);
    return (categories.length === CATEGORIES.length) ? null : categories;
  };

  onSelect = newSelection => {
    this.setState({selection: newSelection});
    filter.categories = this.fromSelected(newSelection.getSelected());
  };

  columns = [
    {
      id: 'name'
    },

    {
      id: 'description',
      title: i18n('Description')
    }
  ];

  render() {
    const {data, selection} = this.state;
    return (
      <div className="activities-widget__category-selector">
        <Table
          data={data}
          columns={this.columns}
          selection={selection}
          onSelect={this.onSelect}
          caption={i18n('Activity categories')}
          selectable
        />
      </div>
    );
  }
}


export default EditFormCategorySelector;
