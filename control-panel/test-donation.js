import Vue from 'vue';
import socket from './sockets';

export default () => new Vue({
  el: '#test_donation',
  data: {
    name: '',
    donorName: '',
    amount: 0,
    message: ''
  },
  methods: {
    clear: function(){
      this.name = '';
      this.donorName = '';
      this.amount = 0;
      this.message = ''
    },
    display: function(){
      socket.emit('test-notification', {
        name: this.name,
        donorName: this.donorName,
        amount: this.amount,
        message: this.message
      });
      this.clear();
    }
  }
})