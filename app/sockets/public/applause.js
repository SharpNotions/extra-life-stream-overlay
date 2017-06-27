'use strict';

// public client has sent applause
module.exports = function (io, socket){
  socket.on('applause', function(data, cb){
    if(socket.rooms.hasOwnProperty('public')){
      console.log('User has requested applause');
    }
  })
};