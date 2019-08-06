import React from 'react';
import PropTypes from 'prop-types';

import LoaderInline
  from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
import Link from '@jetbrains/ring-ui/components/link/link';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import withTimerHOC from '@jetbrains/hub-widget-ui/dist/timer';

import ContentDefaultActivity from './content-default-activity';
import ContentCommentActivity from './content-comment-activity';

import './style/activities-widget.scss';

class ActivitiesContent extends React.Component {

  static propTypes = {
    activities: PropTypes.array,
    isLoading: PropTypes.bool,
    isLoadDataError: PropTypes.bool,
    onEdit: PropTypes.func,
    editable: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  renderNoActivitiesError() {
    return (
      <EmptyWidget
        face={EmptyWidgetFaces.OK}
        message={i18n('No activities found')}
      >
        {
          this.props.editable &&
          (
            <Link
              pseudo
              onClick={this.props.onEdit}
            >
              {i18n('Edit search query')}
            </Link>
          )
        }
      </EmptyWidget>
    );
  }

  renderLoadDataError = () => (
    <EmptyWidget
      face={EmptyWidgetFaces.ERROR}
      message={i18n('Can\'t load information from service.')}
    />
  );

  renderLoader = () => (<LoaderInline/>);

  renderBody = () => (
    <div className="activities-widget">
      {
        (this.props.activities || []).map(activity => (
          <div key={activity.id}>
            {this.renderActivity(activity)}
          </div>
        ))
      }
    </div>
  );

  renderActivity = activity => {
    const categoryId = activity.category.id;
    if (categoryId === 'CommentsCategory') {
      return <ContentCommentActivity activity={activity}/>;
    } else {
      return <ContentDefaultActivity activity={activity}/>;
    }
  };

  render() {
    const {
      activities,
      isLoading,
      isLoadDataError
    } = this.props;

    if (isLoading) {
      return this.renderLoader();
    }
    if (isLoadDataError) {
      return this.renderLoadDataError();
    }
    if (!activities || !activities.length) {
      return this.renderNoActivitiesError();
    }
    return this.renderBody();
  }
}


export default withTimerHOC(ActivitiesContent);
