import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';


class ContentActionActivity extends ContentDefaultActivity {

  constructor(props) {
    super(props);
  }

  getActionTitle = () => {
    const categoryId = this.props.activity.category.id;
    switch (categoryId) {
      case 'IssueCreatedCategory':
        return i18n('created issue');
      case 'IssueResolvedCategory':
        return i18n('resolved issue');
      default:
        throw new Error(`Unexpected category ${categoryId}`);
    }
  };

  // eslint-disable-next-line react/display-name,no-unused-vars
  renderContent = activity => null;
}


export default ContentActionActivity;
