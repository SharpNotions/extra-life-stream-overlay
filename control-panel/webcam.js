import Vue from 'vue';
import socket from './sockets';

function dataUpdated(data){
  if(data){
    this.enabled = !data.disabled;
  } else {
    this.enabled = true;
  }
}

export default () => new Vue({
  el: '#webcam',
  data: {
    enabled: true
  },
  watch:{
    enabled: function(){
      socket.emit('webcam', {
        disabled: !this.enabled
      }, dataUpdated.bind(this));
    }
  },
  mounted: function(){
    socket.emit('webcam', null, dataUpdated.bind(this));
    socket.on('webcam', dataUpdated.bind(this));
  }
});