const webcam = require('../../../../../data/webcam');

module.exports = (io, socket) => {
  socket.on('get-webcam', (callback) => {
    callback({
      success: true,
      disabled: webcam.disabled
    });
  })
}