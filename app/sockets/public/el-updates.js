const monitor = require('../../el').monitor;

module.exports = (io, socket) => {
  
  const teamUpdated = (info) => {
    socket.emit('team-info', info);
  };
  const rosterUpdated = (roster) => {
    socket.emit('roster-update', roster);
  }
  const donationsReceived = (donations) => {
    socket.emit('donations', donations);
  };
  const memberUpdated = (member) => {
    socket.emit('member-update', member);
  };
  const memberAdded = (member) => {
    socket.emit('member-added', member);
  };

  monitor.emitter.on(monitor.events.TEAM_INFO_UPDATED, teamUpdated);
  monitor.emitter.on(monitor.events.MEMBER_ADDED, memberAdded);
  monitor.emitter.on(monitor.events.ROSTER_CHANGE, rosterUpdated);
  monitor.emitter.on(monitor.events.MEMBER_UPDATED, memberUpdated);
  monitor.emitter.on(monitor.events.MEMBER_DONATIONS, donationsReceived);

  socket.on('disconnect', () => {
    monitor.emitter.removeListener(monitor.events.TEAM_INFO_UPDATED, teamUpdated);
    monitor.emitter.removeListener(monitor.events.MEMBER_ADDED, memberAdded);
    monitor.emitter.removeListener(monitor.events.ROSTER_CHANGE, rosterUpdated);
    monitor.emitter.removeListener(monitor.events.MEMBER_UPDATED, memberUpdated);
    monitor.emitter.removeListener(monitor.events.MEMBER_DONATIONS, donationsReceived);
  });

  socket.emit('team-info', monitor.getTeamInfo());
  socket.emit('roster-update', monitor.getRoster());
};