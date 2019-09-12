import React from 'react';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';
import CollapsibleBlock from './components/collapsible-block';
import diff from './diff';

class ContentTextActivity extends ContentDefaultActivity {

  // eslint-disable-next-line react/display-name
  renderContent = activity => {
    const fieldName = activity.field.presentation;

    const formattedDiff = diff.format('wdiff-html',
      diff(activity.removed || '', activity.added || '')
    );

    return (
      <div className="activities-widget__activity__text">
        <CollapsibleBlock fieldName={fieldName}>
          <div className="activities-widget__activity__text__value">
            <span dangerouslySetInnerHTML={{__html: formattedDiff}}/>
          </div>
        </CollapsibleBlock>
      </div>
    );
  };
}

export default ContentTextActivity;
