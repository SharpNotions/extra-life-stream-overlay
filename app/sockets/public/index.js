const scanDirectory = require('../../scanDirectory');
const path = require('path');

const extraLifeUpdates = require('./el-updates');
const socketListeners = scanDirectory(path.resolve(__dirname, './per-socket'), [], '.js', false).map(path => require(path));
console.log('socket listeners', socketListeners);

module.exports = (io) => {
  extraLifeUpdates(io, 'overlay');
  io.on('connect', socket => {
    console.log(`Socket ${socket.id} connected`);
    socketListeners.forEach(listener => listener(io, socket));
    socket.on('disconnect', reason => {
      console.log(`Socket ${socket.id} disconnected: ${reason}`);
    });
  });
};