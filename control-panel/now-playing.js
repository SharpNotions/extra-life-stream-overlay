import socket from './sockets';
import Vue from 'vue';

export default () => new Vue({
  el:'#now_playing',
  data:{
    title: 'Now Playing',
    game: 'Extra Life 2019'
  },
  methods: {
    update: function(){
      socket.emit('now-playing', {
        title: this.title,
        game: this.game
      });
    },
    refresh: function(){
      socket.emit('now-playing', null, data => {
        this.title = data.title;
        this.game = data.game;
      });
      socket.on('now-playing', (data) => {
        if(data){
          if(data.title) this.title = data.title;
          if(data.game) this.game = data.game;
        }
      });
    }
  },
  mounted: function(){
    this.refresh();
  }
});