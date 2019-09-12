import 'babel-polyfill';

import ActivitiesWidget from '../app/activities-widget';


describe('ActivitiesWidget', () => {
  it('should export ActivitiesWidget', () => {
    (ActivitiesWidget).should.be.a('function');
  });
});
