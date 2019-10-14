import 'babel-polyfill';
import {mount} from 'enzyme';
import React from 'react';
import chai from 'chai';
import {setLocale} from 'hub-dashboard-addons/dist/localization';

import ActivitiesEditForm from '../app/activities-edit-form';
import TRANSLATIONS from '../app/translations';
import filter from '../app/activities-filter';

import {getDashboardApiMock} from './mocks';

describe('ActivitiesEditForm', () => {

  let dashboardApiMock;
  let onSubmitSpy;
  let onCancelSpy;
  let onServiceChangeSpy;

  beforeEach(() => {
    dashboardApiMock = getDashboardApiMock();
    onSubmitSpy = chai.spy();
    onCancelSpy = chai.spy();
    onServiceChangeSpy = chai.spy();
    filter.youTrackId = '1-1';
    filter.youTrackUrl = 'localhost';
  });

  it('should export ActivitiesEditForm', () => {
    (ActivitiesEditForm).should.be.a('function');
  });

  const mountActivitiesEditForm = () =>
    mount(
      <ActivitiesEditForm
        title={'hello-title'}
        onSubmit={onSubmitSpy}
        onCancel={onCancelSpy}
        onServiceChange={onServiceChangeSpy}
        dashboardApi={dashboardApiMock}
      />
    );

  it('should create component', () => {
    const editFormInstance = mountActivitiesEditForm().instance();
    editFormInstance.should.be.an('object');
    editFormInstance.state.title.should.be.equal('hello-title');
    editFormInstance.state.isLoading.should.be.an(false);
  });

  it('should call cancel-callback on cancel', () => {
    const editFormWrapper = mountActivitiesEditForm();
    const cancelButton = editFormWrapper.
      find('button[data-test="cancel-button"]');

    (onCancelSpy).should.not.be.called();

    cancelButton.props().onClick();
    editFormWrapper.update();

    (onCancelSpy).should.be.called();
  });

  it('should respect localization', () => {
    let cancelButton = mountActivitiesEditForm().
      find('button[data-test="cancel-button"]');

    (cancelButton.text().trim()).should.be.equal('Cancel');

    setLocale('ru', TRANSLATIONS);
    cancelButton = mountActivitiesEditForm().
      find('button[data-test="cancel-button"]');

    (cancelButton.text().trim()).should.be.equal('Отмена');
  });
});
