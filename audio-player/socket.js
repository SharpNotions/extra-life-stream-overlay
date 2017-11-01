import io from 'socket.io';

const socket = io('/public');

socket.on('connect', () => {
  console.log(`[Socket] ${socket.id} connected`);
  socket.emit('join', { room: 'audio' }, (response) => {
    if(response.success){
      console.info('[Socket]', response.result);
    } else {
      console.warn('[Socket] could not join room audio', response.result);
    }
  });
});
socket.on('disconnect', () => console.log(`[Socket] ${socket.id} disconnected`));

export default socket;