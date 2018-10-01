import DashboardAddons from 'hub-dashboard-addons';
import React from 'react';
import {render} from 'react-dom';
import {setLocale} from 'hub-dashboard-addons/dist/localization';

import Widget from './widget';
import TRANSLATIONS from './translations';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) => {
  // setLocale('ru', TRANSLATIONS);
  setLocale(DashboardAddons.locale, TRANSLATIONS);
  return render(
    <Widget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
    />,
    document.getElementById('app-container')
  );
});
