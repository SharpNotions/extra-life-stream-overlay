module.exports = (io, socket) => {
  socket.on('test-notification', data => {
    data = data || {};

    const donationData = {
      name: data.name,
      donors: [
        {
          displayName: data.displayName,
          amount: data.amount
        }
      ]
    };
    io.to('overlay').emit('donations', donationData);
  });
};