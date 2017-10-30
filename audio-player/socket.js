import io from 'socket.io';

const socket = io('/public');

socket.on('connect', () => console.log(`[Socket] ${socket.id} connected`));
socket.on('disconnect', () => console.log(`[Socket] ${socket.id} disconnected`));

export default socket;