const monitor = require('../../el').monitor;

module.exports = (io, room) => {
  
  const teamUpdated = (info) => {
    io.to(room).emit('team-info', info);
  };
  const rosterUpdated = (roster) => {
    io.to(room).emit('roster-update', roster);
  }
  const donationsReceived = (donations) => {
    io.to(room).emit('donations', donations);
  };
  const memberUpdated = (member) => {
    io.to(room).emit('member-update', member);
  };
  const memberAdded = (member) => {
    io.to(room).emit('member-added', member);
  };

  monitor.emitter.on(monitor.events.TEAM_INFO_UPDATED, teamUpdated);
  monitor.emitter.on(monitor.events.MEMBER_ADDED, memberAdded);
  monitor.emitter.on(monitor.events.ROSTER_CHANGE, rosterUpdated);
  monitor.emitter.on(monitor.events.MEMBER_UPDATED, memberUpdated);
  monitor.emitter.on(monitor.events.MEMBER_DONATIONS, donationsReceived);
};