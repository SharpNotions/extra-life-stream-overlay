module.exports = (io, socket) => {
  socket.on('play-audio', (data) => {
    if(data && data.file){
      io.to('audio').emit('play-audio', { file: data.file });
    } else {
      console.warn('[Socket] audio request did not contain a file property');
    }
  });
};