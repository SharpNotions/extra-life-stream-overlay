import io from 'socket.io';

const connect = () => {
  console.log(`Socket ${socket.id} connected`);
  socket.emit('join', { room: 'control' }, data => {
    if(data){
      if(data.success){
        console.log('[socket]', data.result);
      } else {
        console.warn('[socket] unable to join control room:', data.result);
      }
    } else {
      console.error('[socket] no data received from socket#join')
    }
  });
};

const disconnect = (reason) => {
  console.log(`Socket ${socket.id} disconnected: ${reason}`);
};

const socket = io('/public');
socket.on('connect', connect);
socket.on('reconnect', connect);
socket.on('disconnect', disconnect);

export default socket;