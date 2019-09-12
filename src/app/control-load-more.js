import React from 'react';
import PropTypes from 'prop-types';

import LoaderInline
  from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
import Link from '@jetbrains/ring-ui/components/link/link';
import Message from '@jetbrains/ring-ui/components/message/message';
import Popup from '@jetbrains/ring-ui/components/popup/popup';
import exception from '@jetbrains/icons/exception.svg';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import './style/activities-widget.scss';

const {Directions} = Popup.PopupProps;

class ControlLoadMore extends React.Component {

  static propTypes = {
    onLoadMore: PropTypes.func,
    hasMore: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoadingMore: false,
      loadingMoreError: null
    };
  }

  loadMore = async () => {
    try {
      this.setState({isLoadingMore: true});
      await this.props.onLoadMore();
    } catch (error) {
      this.setState({loadingMoreError: error.message});
    } finally {
      this.setState({isLoadingMore: false});
    }
  };

  resetLoadingMoreError = () => {
    this.setState({loadingMoreError: null});
  };

  render() {
    return (
      <div className="activities-widget__load-more">
        {
          this.state.isLoadingMore && (
            <LoaderInline/>
          )
        }
        {
          this.state.loadingMoreError &&
          (
            <Message
              icon={exception}
              title={i18n('Could not request more activities')}
              onClose={this.resetLoadingMoreError}
              direction={Directions.TOP_LEFT}
            >
              {this.state.loadingMoreError}
            </Message>
          )
        }
        {
          !this.state.isLoadingMore &&
          (
            <div onClick={this.loadMore}>
              <Link pseudo>{i18n('Show more')}</Link>
            </div>
          )
        }
      </div>
    );
  }
}

export default ControlLoadMore;
