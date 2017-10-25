'use strict';

// public client has requested to join the public room
module.exports = (io, socket) => {
  socket.on('join', (data, cb) => {
    if (socket.rooms.hasOwnProperty('public')) {
      cb({ success: false, result: 'already in the public room'});
    } else {
      socket.join('public');
      cb({ success: true, result: 'joined room: public'});
    }
  });
};
