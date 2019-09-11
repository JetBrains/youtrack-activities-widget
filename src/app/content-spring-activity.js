import React from 'react';

import Link from '@jetbrains/ring-ui/components/link/link';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';
import filter from './activities-filter';


class ContentSprintActivity extends ContentDefaultActivity {

  // eslint-disable-next-line react/display-name
  renderSprintLink = (sprint, removed) => (
    <span key={`${sprint.id}-${removed}`}>
      <Link
        href={`${filter.youTrackUrl}/agiles/${sprint.agile.id}/${sprint.id}`}
        className={removed ? 'activities-widget__activity__change__removed' : ''}
      >
        {sprint.name}
      </Link>
      &nbsp;
    </span>
  );

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const field = activity.field;
    return (
      <div key={activity.id}>
        <span>
          <span className="activities-widget__activity__change__field-name">{field.presentation}</span>{' \u27F6 '}
          {activity.removed.map(sprint => this.renderSprintLink(sprint, true))}
          {activity.added.map(sprint => this.renderSprintLink(sprint, false))}
        </span>

      </div>
    );
  }
}

export default ContentSprintActivity;
