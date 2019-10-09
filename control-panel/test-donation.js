import Vue from 'vue';
import socket from './sockets';

export default () => new Vue({
  el: '#test_donation',
  data: {
    name: '',
    displayName: '',
    amount: 0
  },
  methods: {
    clear: function(){
      this.name = '';
      this.displayName = '';
      this.amount = 0;
    },
    display: function(){
      const send = {
        name: this.name,
        displayName: this.displayName,
        amount: this.amount
      };
      console.log(send);
      socket.emit('test-notification', send);
      this.clear();
    }
  }
})