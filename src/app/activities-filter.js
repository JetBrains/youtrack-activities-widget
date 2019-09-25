import {observable} from 'mobx';

import {CATEGORIES} from './components/categories';

class ActivitiesFilter {

  static DEFAULT_REFRESH_PERIOD = 240; // eslint-disable-line no-magic-numbers

  @observable query = null;

  @observable author = null;

  @observable youTrackId = null;

  @observable youTrackUrl = null;

  // eslint-disable-next-line max-len
  @observable categoriesIds = CATEGORIES.filter(it => it.default).map(it => it.id);

  @observable refreshPeriod = ActivitiesFilter.DEFAULT_REFRESH_PERIOD;

  dashboardApi = null;

  restore(props) {
    try {
      const storedFilter = props.configWrapper.getFieldValue('filter');
      this.query = storedFilter.query;
      this.author = storedFilter.author || null;
      this.youTrackId = storedFilter.youTrack.id;
      this.youTrackUrl = storedFilter.youTrack.homeUrl;
      this.categoriesIds = storedFilter.categories;
      this.refreshPeriod = storedFilter.refreshPeriod ||
        ActivitiesFilter.DEFAULT_REFRESH_PERIOD;
    } catch (e) {
      this.sync(props);
    }
  }

  async sync(props) {
    await props.configWrapper.update({filter: this.toConfig()});
  }

  toConfig() {
    const toConfigAuthor = author => author && {
      id: author.id,
      name: author.name,
      avatarURL: author.avatarURL
    };

    // eslint-disable-next-line max-len
    const toConfigCategoriesIds = categories => categories && categories.map(it => it.id);

    return {
      query: this.query,
      author: toConfigAuthor(this.author),
      categoriesIds: toConfigCategoriesIds(this.categoriesIds),
      youTrack: {id: this.youTrackId, homeUrl: this.youTrackUrl},
      refreshPeriod: this.refreshPeriod
    };
  }
}

// @ts-ignore
const filter = window.filter = new ActivitiesFilter();

export default filter;
