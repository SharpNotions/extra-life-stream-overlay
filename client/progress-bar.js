import Vue from 'vue';

const donationProgress = () => new Vue({
  el: '#progress',
  data: {
    raised: 0,
    goal: 2500
  },
  computed: {
    pct: function(){
      return `width: ${this.raised / this.goal * 100}%`;
    }
  }
});

export default donationProgress;