import React from 'react';
import PropTypes from 'prop-types';

import {format} from 'date-fns';

import './style/activities-widget.scss';

const FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

class ContentBasicActivity extends React.Component {

  static propTypes = {
    activity: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  presentChange = changes => {
    if (Array.isArray(changes)) {
      if (changes.length === 0) {
        return '[-]';
      }
      return changes.map(change => `[${change.id}:${change.name}]`).join();
    }
    return changes || '-';
  };

  render() {
    const {activity} = this.props;
    return (
      <div key={`activity-${activity.id}`} className="activities-widget__activity">
        <p>{`category: ${activity.category.id}`}</p>
        <p>{`issue: ${activity.target.idReadable}`}</p>
        <p>{`author: ${activity.author.login}`}</p>
        <p>{`timestamp: ${activity.timestamp} (${format(activity.timestamp, FORMAT)})`}</p>
        <p>{`added: ${this.presentChange(activity.added)}`}</p>
        <p>{`removed: ${this.presentChange(activity.removed)}`}</p>
      </div>
    );
  }
}


export default ContentBasicActivity;
