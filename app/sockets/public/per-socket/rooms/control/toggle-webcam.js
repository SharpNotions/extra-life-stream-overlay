const webcamData = require('../../../../../data/webcam');

module.exports = (io, socket) => {
  socket.on('webcam', (data, callback) => {
    if(data){
      webcamData.disabled = !!data.disabled;
      io.to('overlay').emit('webcam', {
        disabled: webcamData.disabled
      });
    }
    if(callback){
      callback({
        disabled: webcamData.disabled
      });
    }
  });
};