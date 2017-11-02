import Vue from 'vue';
import socket from './sockets';

export default () => {
  return new Vue({
    el: '#audio_control',
    data: {
      files: []
    },
    methods:{
      playFile: function(filename){
        socket.emit('play-audio', { file: filename });
      }
    },
    mounted: function(){
      socket.on('audio-added', (response) => {
        this.files.push(...response.files);
      });
    }
  })
};