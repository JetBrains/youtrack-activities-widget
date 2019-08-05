import {observable} from 'mobx';
import {addDays, format, parse} from 'date-fns';

const FORMAT = 'YYYY-MM-DD';

class ActivitiesFilter {

  static DEFAULT_REFRESH_PERIOD = 240; // eslint-disable-line no-magic-numbers

  @observable context = null;
  @observable query = null;

  @observable startDate = null;
  @observable endDate = null;

  @observable author = null;

  @observable youTrackId = null;

  @observable refreshPeriod = ActivitiesFilter.DEFAULT_REFRESH_PERIOD;

  restore(props) {
    try {
      const filter = props.configWrapper.getFieldValue('filter');
      const WEEK_AGO = -7;
      this.query = filter.query;
      this.context = filter.context;

      this.startDate = filter.startDate
        ? parse(filter.startDate, FORMAT)
        : addDays(new Date(), WEEK_AGO);
      this.endDate = filter.endDate
        ? parse(filter.endDate, FORMAT)
        : new Date();

      this.author = filter.author || null;
      this.refreshPeriod = filter.refreshPeriod;
    } catch (e) {
      this.sync(props);
    }
  }

  async sync(props) {
    await props.configWrapper.update({filter: this.toConfig()});
  }

  toConfig() {
    const context = this.context;
    const author = this.author;

    function formatDate(date) {
      return date ? format(date, FORMAT) : null;
    }

    return {
      context: context
        ? {id: context.id, name: context.name, $type: context.$type}
        : null,
      query: this.query,

      startDate: formatDate(this.startDate),
      endDate: formatDate(this.endDate),

      author: author
        ? {id: author.id, name: author.name, avatarURL: author.avatarURL}
        : null,

      youTrack: {id: this.youTrackId},

      refreshPeriod: this.refreshPeriod
    };
  }
}

// @ts-ignore
const filter = window.filter = new ActivitiesFilter();

export default filter;
