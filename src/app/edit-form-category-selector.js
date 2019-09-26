import React from 'react';

import Table from '@jetbrains/ring-ui/components/table/table';
import Selection from '@jetbrains/ring-ui/components/table/selection';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import filter from './activities-filter';
import {CATEGORIES} from './components/categories';
import './style/activities-widget.scss';

class EditFormCategorySelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: CATEGORIES.sort((a, b) => a.name.localeCompare(b.name)),
      selection: new Selection({
        data: CATEGORIES,
        selected: this.toSelected(filter.categoriesIds)
      })
    };
  }

  toSelected = categoriesIds => {
    let selected;
    if (categoriesIds) {
      selected = CATEGORIES.filter(it => categoriesIds.indexOf(it.id) >= 0);
    } else {
      selected = CATEGORIES;
    }
    return new Set(selected);
  };

  fromSelected = selected => [...selected].map(it => it.id);

  onSelect = newSelection => {
    this.setState({selection: newSelection});
    filter.categoriesIds = this.fromSelected(newSelection.getSelected());
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
