const nowPlaying = require('../../../../../data/now-playing');

module.exports = (io, socket) => {
  socket.on('get-now-playing', function(callback) {
    callback({
      success: true,
      title: nowPlaying.title,
      game: nowPlaying.game
    });
  });
};