// const scanDirectory = require('../scanDirectory');
// const path = require('path');

// const publicFunctions = [];

// scanDirectory(path.join(__dirname, 'public')).forEach(file => {
//   publicFunctions.push(require(file));
// });

const setup = {
  public: require('./public')// (io) => {
  //   io.on('connect', socket => {
  //     console.log('Hello public user');
  //     socket.on('disconnect', () => {
  //       console.log('Goodbye public user');
  //     });
  //     publicFunctions.forEach(fn => fn(io, socket));
  //   });
  // }
}

module.exports = setup;
