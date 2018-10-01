import {i18n} from 'hub-dashboard-addons/dist/localization';

export default function (username = 'World') {
  return i18n('Hello, {{username}}', {username});
}
