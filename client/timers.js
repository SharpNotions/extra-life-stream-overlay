import Vue from 'vue';
import moment from 'moment';

const formatDuration = duration => {
  const h = ('' + duration.hours()) || '0';
  const m = ('' + duration.minutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const timers = () => new Vue({
  el: '#timers',
  data: {
    now: new Date(),
    morning: moment().hours(9).minutes(0).seconds(0).toDate()
  },
  computed:{
    localTime: function() {
      return moment(this.now).format('HH:mm');
    },
    timePlayed: function(){
      const duration = moment.duration(moment(this.now).diff(this.morning));
      return formatDuration(duration);
    },
    timeRemaining: function(){
      const duration = moment.duration(moment(this.morning).add(1, 'd').diff(this.now));
      duration.add(1, 'm');
      return formatDuration(duration);
    }
  },
  mounted: function(){
    setInterval(() => this.now = new Date(), 1000);
  }
});

export default timers;