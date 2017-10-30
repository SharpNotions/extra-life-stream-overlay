const nowPlaying = require('../../../../../data/now-playing');

module.exports = (io, socket) => {
  socket.on('now-playing', function(data, callback) {
    if(data && data.game){
      nowPlaying.title = data.title || 'Now Playing';
      nowPlaying.game = data.game || 'Extra Life 2017';
      
      socket.broadcast.emit('now-playing', {
        title: nowPlaying.title,
        game: nowPlaying.game
      });
      
    }
    if(callback){
      callback({
        title: nowPlaying.title,
        game: nowPlaying.game
      });
    }
  });
};