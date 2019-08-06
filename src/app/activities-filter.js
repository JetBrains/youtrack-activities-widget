import {observable} from 'mobx';
import {format, parse} from 'date-fns';

const FORMAT = 'YYYY-MM-DD';

class ActivitiesFilter {

  static DEFAULT_REFRESH_PERIOD = 240; // eslint-disable-line no-magic-numbers

  @observable query = null;

  @observable author = null;

  @observable date = null;

  @observable youTrackId = null;

  @observable youTrackUrl = null;

  @observable refreshPeriod = ActivitiesFilter.DEFAULT_REFRESH_PERIOD;

  restore(props) {
    try {
      const storedFilter = props.configWrapper.getFieldValue('filter');
      this.query = storedFilter.query;
      this.date = storedFilter.date && parse(storedFilter.date, FORMAT);
      this.author = storedFilter.author || null;
      this.youTrackId = storedFilter.youTrack.id;
      this.youTrackUrl = storedFilter.youTrack.homeUrl;
      this.refreshPeriod = storedFilter.refreshPeriod;
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

    const toConfigDate = date => date && format(date, FORMAT);

    return {
      query: this.query,
      date: toConfigDate(this.date),
      author: toConfigAuthor(this.author),
      youTrack: {id: this.youTrackId, homeUrl: this.youTrackUrl},
      refreshPeriod: this.refreshPeriod
    };
  }
}

// @ts-ignore
const filter = window.filter = new ActivitiesFilter();

export default filter;
