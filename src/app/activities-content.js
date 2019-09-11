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
import ContentProjectActivity from './content-project-activity';
import ContentCustomFieldActivity from './content-custom-field-activity';
import ContentLinkActivity from './content-link-activity';
import ContentTextActivity from './content-text-activity';
import ContentActionActivity from './content-action-activity';
import ContentVcsChangeActivity from './content-vcs-activity';
import ContentSprintActivity from './content-sprint-activity';
import ContentWorkItemsActivity from './content-workitems-activity';
import './style/activities-widget.scss';

class ActivitiesContent extends React.Component {

  static propTypes = {
    activities: PropTypes.array,
    isLoading: PropTypes.bool,
    isLoadDataError: PropTypes.bool,
    onEdit: PropTypes.func,
    onLoadMore: PropTypes.func,
    editable: PropTypes.bool,
    hasMore: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoadingMore: false
    };
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
              {i18n('Edit filter settings')}
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

  renderLoader = () => <LoaderInline/>;

  loadMore = async () => {
    this.setState({isLoadingMore: true});
    await this.props.onLoadMore();
    this.setState({isLoadingMore: false});
  };

  renderBody = () => (
    <div className="activities-widget">
      {
        (this.props.activities || []).map(activity => (
          <div key={activity.id}>
            {this.renderActivity(activity)}
          </div>
        ))
      }
      {
        this.state.isLoadingMore &&
        (
          <div className="activities-widget__load-more">
            <LoaderInline/>
          </div>
        )
      }
      {
        !this.state.isLoadingMore && this.props.hasMore &&
        (
          <div
            onClick={this.loadMore}
            className="activities-widget__load-more"
          >
            <Link pseudo>{i18n('Show more')}</Link>
          </div>
        )
      }
    </div>
  );

  // eslint-disable-next-line complexity
  renderActivity = activity => {
    const categoryId = activity.category.id;
    switch (categoryId) {
      case 'CommentsCategory':
        return <ContentCommentActivity activity={activity}/>;
      case 'CustomFieldCategory':
        return <ContentCustomFieldActivity activity={activity}/>;
      case 'SprintCategory':
        return <ContentSprintActivity activity={activity}/>;
      case 'ProjectCategory':
        return <ContentProjectActivity activity={activity}/>;
      case 'LinksCategory':
        return <ContentLinkActivity activity={activity}/>;
      case 'SummaryCategory':
      case 'DescriptionCategory':
        return <ContentTextActivity activity={activity}/>;
      case 'IssueCreatedCategory':
      case 'IssueResolvedCategory':
        return <ContentActionActivity activity={activity}/>;
      case 'VcsChangeCategory':
        return <ContentVcsChangeActivity activity={activity}/>;
      case 'WorkItemCategory':
        return <ContentWorkItemsActivity activity={activity}/>;
      default:
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
