import React from 'react';
import PropTypes from 'prop-types';
import ClickableLink from '@jetbrains/ring-ui/components/link/link';
import {i18n} from 'hub-dashboard-addons/dist/localization';

class CollapsibleBlock extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    fieldName: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.state = {
      expanded: false
    };
  }


  toggleExpanded() {
    const oldValue = this.state.expanded;
    this.setState({expanded: !oldValue});
  }

  render() {
    const fieldName = this.props.fieldName;
    return (
      <div className="activities-widget__issue">
        <div>
          <span className="activities-widget__activity__text__field-name">
            {`${fieldName}:`}
          </span>
          <ClickableLink onClick={this.toggleExpanded}>
            {this.state.expanded && (
              '\u25bc'
            )}
            {!this.state.expanded && (
              '\u25ba'
            )}
            {i18n('Details')}
          </ClickableLink>
        </div>
        <div className="activities-widget__activity__text__value">
          {this.state.expanded && this.props.children}
        </div>
      </div>
    );
  }
}


export default CollapsibleBlock;
