import io from 'socket.io';

const setupSockets = (views) => {

  const connectHandler = () => {
    console.log('Socket Connected');
    socket.emit('join', { room: 'overlay' }, function(data){
      if(data.success){
        console.info(data.result);
      } else {
        console.warn('socket#join failed', data);
      }
    });
  };

  const teamUpdatedHandler = (data) => {
    views.donationProgress.goal = data.fundraisingGoal;
    views.donationProgress.raised = data.totalRaisedAmount;
  };

  const rosterUpdatedHandler = (data) => {
    console.log('roster-update', data);
    views.roster.members = data;
    views.topInfo.checkMembers(data);
  };

  const donationHandler = data => {
    console.log('donations!', data);
    const displayName = data.name;
    data.donors.forEach(donor => {
      views.notification.show({
        displayName: displayName,
        from: donor.displayName || 'Anonymous',
        amount: donor.amount,
        message: donor.message || ''
      });
    });
  };

  const memberUpdatedHandler = (member) => {
    console.log('member-updated', member);
  };

  const memberAddedHandler = (member) => {
    console.log('member-added', member);
  };

  const webcamChangedHandler = (data) => {
    if(data && data.disabled){
      document.body.classList.add('no-cam');
    } else {
      if(document.body.classList.contains('no-cam')){
        document.body.classList.remove('no-cam');
      }
    }
  };

  const nowPlayingHandler = (data) => {
    if(data){
      if(data.title){
        views.nowPlaying.title = data.title;
      }
      if(data.game){
        views.nowPlaying.game = data.game;
      }
    }
  };

  const socket = io('/public');
  socket.on('connect', connectHandler);
  socket.on('team-info', teamUpdatedHandler);
  socket.on('roster-update', rosterUpdatedHandler);
  socket.on('donations', donationHandler);
  socket.on('member-update', memberUpdatedHandler);
  socket.on('member-added', memberAddedHandler);
  socket.on('webcam', webcamChangedHandler);
  socket.on('now-playing', nowPlayingHandler);

  socket.emit('get-now-playing', function(data){
    if(data && data.success){
      nowPlayingHandler(data);
    } else {
      console.warn('[socket] could not get latest game data');
    }
  });

  socket.emit('get-webcam', (result) => {
    if(result && result.success){
      webcamChangedHandler(result);
    } else {
      console.warn('[socket] could not get latest webcam data');
    }
  });

};

export default setupSockets;