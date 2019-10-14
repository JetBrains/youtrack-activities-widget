import 'babel-polyfill';
import {mount} from 'enzyme';
import React from 'react';

import ActivitiesWidget from '../app/activities-widget';

import {
  getDashboardApiMock, getRegisterWidgetApiMock
} from './mocks';

describe('ActivitiesWidget', () => {

  let dashboardApiMock;
  let registerWidgetApiMock;

  beforeEach(() => {
    dashboardApiMock = getDashboardApiMock();
    registerWidgetApiMock = getRegisterWidgetApiMock();
  });

  it('should export ActivitiesWidget', () => {
    (ActivitiesWidget).should.be.a('function');
  });

  const mountActivitiesWidget = () =>
    mount(
      <ActivitiesWidget
        dashboardApi={dashboardApiMock}
        registerWidgetApi={registerWidgetApiMock}
      />
    );

  it('should create component', () => {
    const widgetInstance = mountActivitiesWidget().instance();

    (widgetInstance).should.be.an('object');
    (widgetInstance.state.isLoading).should.be.equal(true);
    (widgetInstance.state.isConfiguring).should.be.equal(false);
  });

  it('should register widget api during initialization', () => {
    (registerWidgetApiMock).should.not.be.called();

    mountActivitiesWidget();

    (registerWidgetApiMock).should.be.called();
  });
});
