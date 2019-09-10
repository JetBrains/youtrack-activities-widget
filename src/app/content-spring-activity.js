import React from 'react';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import Link from '@jetbrains/ring-ui/components/link/link';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';
import filter from './activities-filter';


class ContentSprintActivity extends ContentDefaultActivity {


  collectSprints = (activity, propertyName, target) => {
    activity[propertyName].forEach(sprint => {
      if (!target[sprint.agile.id]) {
        target[sprint.agile.id] = {
          name: sprint.agile.name,
          id: sprint.agile.id
        };
      }
      if (!target[sprint.agile.id][propertyName]) {
        target[sprint.agile.id][propertyName] = [];
      }
      target[sprint.agile.id][propertyName].push(sprint);
    });
  };

  groupByBoard = activity => {
    const agiles = {};
    this.collectSprints(activity, 'added', agiles);
    this.collectSprints(activity, 'removed', agiles);
    return agiles;
  };

  // eslint-disable-next-line react/display-name
  renderSprintLink = (sprint, removed) => (
    <span>
      <Link href={`${filter.youTrackUrl}/agiles/${sprint.agile.id}/${sprint.id}`} className={removed && 'activities-widget__activity__change__removed'}>
        {sprint.name}
      </Link>
      &nbsp;
    </span>
  );

  // eslint-disable-next-line react/display-name
  renderChangesForBoard = board => (
    <span key={board.id}>
      {i18n('Board')} <span className="activities-widget__activity__change__field-name">{board.name}</span>{' \u27F6 '}
      {board.removed.map(sprint => this.renderSprintLink(sprint, true))}
      {board.added.map(sprint => this.renderSprintLink(sprint, false))}
    </span>
  );

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const agiles = this.groupByBoard(activity);
    return (
      <div>
        {Object.keys(agiles).map(id => this.renderChangesForBoard(agiles[id]))}
      </div>
    );
  }
}

export default ContentSprintActivity;
