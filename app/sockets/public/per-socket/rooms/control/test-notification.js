module.exports = (io, socket) => {
  socket.on('test-notification', data => {
    data = data || {};

    const donationData = {
      name: data.name || 'Bob',
      donors: [
        {
          donorName: data.donorName || 'Tom',
          donationAmount: data.amount || 15,
          message: data.message || ''
        }
      ]
    };
    io.to('overlay').emit('donations', donationData);
  });
};