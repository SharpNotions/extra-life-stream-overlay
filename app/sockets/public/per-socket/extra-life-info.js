const monitor = require('../../../el').monitor;

/**
 * Broadcast the current cached extra-life info to anyone who connects
 * @param {object} io - the socket.io server or namespace
 * @param {object} socket - the socket object
 */
module.exports = (io, socket) => {
  socket.emit('team-info', monitor.getTeamInfo());
  socket.emit('roster-update', monitor.getRoster());
};