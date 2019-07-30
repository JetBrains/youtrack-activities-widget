import 'hub-dashboard-addons/dashboard.css';

import React from 'react';
import {render} from 'react-dom';
import DashboardAddons from 'hub-dashboard-addons';
import {setLocale} from 'hub-dashboard-addons/dist/localization';
import ConfigWrapper from '@jetbrains/hub-widget-ui/dist/config-wrapper';

import ActivitiesWidget from './activities-widget';
import TRANSLATIONS from './translations';

const CONFIG_FIELDS = ['filter'];

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) => {
  setLocale(DashboardAddons.locale, TRANSLATIONS);
  const configWrapper = new ConfigWrapper(dashboardApi, CONFIG_FIELDS);

  return render(
    <ActivitiesWidget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
      configWrapper={configWrapper}
      editable={DashboardAddons.editable}
    />,
    document.getElementById('app-container')
  );
});
