import React from 'react';
import PropTypes from 'prop-types';
import ClickableLink from '@jetbrains/ring-ui/components/link/link';
import {i18n} from 'hub-dashboard-addons/dist/localization';
import {CaretDown10pxIcon,
  CaretRight10pxIcon} from '@jetbrains/ring-ui/components/icon';

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
      <div className="aw__collapsible-block">
        <div>
          <span className="aw__activity__text__field-name">
            {`${fieldName}:`}
          </span>
          <ClickableLink onClick={this.toggleExpanded}>
            {this.state.expanded && <CaretDown10pxIcon/>}
            {!this.state.expanded && <CaretRight10pxIcon/>}
            <span className="aw__activity__text__field-details">
              {i18n('Details')}
            </span>
          </ClickableLink>
        </div>
        <div className="aw__activity__text__value">
          {this.state.expanded && this.props.children}
        </div>
      </div>
    );
  }
}


export default CollapsibleBlock;
