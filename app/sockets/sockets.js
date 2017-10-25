'use strict';

var scanDirectory = require('../scanDirectory');
var path = require('path');

var publicFunctions = [];

scanDirectory(path.join(__dirname, 'public')).forEach(file => {
  publicFunctions.push(require(file));
});

var setup = {
  public: function(io){
    io.on('connect', socket => {
      console.log('Hello public user');
      socket.on('disconnect', () => {
        console.log('Goodbye public user');
      });
      publicFunctions.forEach(fn => fn(io, socket));
    });
  }
}

module.exports = setup;