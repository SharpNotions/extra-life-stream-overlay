import Vue from 'vue';

const rosterMember = {
  template: '<div>{{displayName}} - <span class="highlight">${{raised}}</span></div>',
  props: ['data'],
  computed: {
    raised: function(){ return this.data.raised },
    displayName: function() { return this.data.displayName; }
  }
};

const roster = () => new Vue({
  el: '#roster',
  data: {
    members: [
      { displayName: 'tester', raised: 0 }
    ]
  },
  computed: {
    contributors: function(){
      return this.members.filter(x => x.raised > 0);
    }
  },
  components : {
    'member': rosterMember
  }
});

export default roster;