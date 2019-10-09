import Vue from 'vue';

const setup = () => new Vue({
  el: '#current_action',
  data: {
    title: 'Now Playing',
    game: 'Extra Life 2019'
  }
});

export default setup;