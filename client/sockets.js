import io from 'socket.io';

const setupSockets = (views) => {
  var socket = io('/public');
  socket.on('connect', function(){
    console.log('Socket Connected');
    socket.emit('join', { }, function(data){
      if(data.success){
        console.info(data.result);
      } else {
        console.warn('socket#join failed');
      }
    });
  });
  socket.on('team-info', function(data){
    views.donationProgress.goal = data.fundraisingGoal;
    views.donationProgress.raised = data.totalRaisedAmount;
  });
  socket.on('roster-update', data => {
    console.log('roster-update', data);
    views.roster.members = data;
    views.topInfo.checkMembers(data);
  });
  socket.on('donations', data => {
    console.log('donations!', data);
    const displayName = data.name;
    data.donors.forEach(donor => {
      views.notification.show({
        displayName: displayName,
        from: donor.donorName || 'Anonymous',
        amount: donor.donationAmount,
        message: donor.message || ''
      });
    });
  });
  socket.on('member-update', member => {
    console.log('member-updated', member);
  });
  socket.on('member-added', member => {
    console.log('member-added', member);
  });
};

export default setupSockets;