const scanDirectory = require('../../../scanDirectory');
const roomHandlers = new Map();
const path = require('path');

/**
 * Handle a socket requesting to join a room. Expected parameters: { room: string }
 * @param {object} io - the server or namespace
 * @param {object} socket - the socket instance
 */
module.exports = (io, socket) => {
  socket.on('join', (data, cb) => {
    const room = (data || {}).room;
    if(room && typeof room === 'string'){
      if(socket.rooms.hasOwnProperty(room)){
        cb({success: true, result: `already in room: ${room}`});
      } else {
        socket.join(room);
        if(!roomHandlers.has(room)){
          roomHandlers.set(room, scanDirectory(path.resolve(__dirname, './rooms/', room)).map(path => require(path)));
        }
        roomHandlers.get(room).forEach(handler => handler(io, socket));
        console.log(`Socket ${socket.id} joined ${room}`);
        cb({success: true, result: `joined room: ${room}`});
      }
    } else {
      cb({success: false, result: 'must specify room'});
    }
  });
};
