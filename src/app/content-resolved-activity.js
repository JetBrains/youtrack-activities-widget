import {i18n} from 'hub-dashboard-addons/dist/localization';

import ContentDefaultActivity from './content-default-activity';

import './style/activities-widget.scss';


class ContentResolvedActivity extends ContentDefaultActivity {

  constructor(props) {
    super(props);
  }

  getActionTitle = () => i18n('resolved issue');

  // eslint-disable-next-line react/display-name,no-unused-vars
  renderContent = activity => null;
}


export default ContentResolvedActivity;
