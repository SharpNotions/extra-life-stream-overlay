'use strict';

var request = require('request');

function getParticipantProfile(participantId){
  var url = `https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=${participantId}&format=json`;
  return new Promise((accept, reject) => {
    request.get({ uri: url, json:true}, (message, err, body) => {
      if(err){
        reject(err);
      } else {
        accept(body);
      }
    });
  });
}


module.exports = {

};