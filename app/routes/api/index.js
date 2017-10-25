const express = require('express');
const extraLife = require('../../el');

var api = express.Router();

api.get('/team', function(req, res){
  res.json(extraLife.monitor.getTeamInfo());
});

api.get('/roster', function(req, res){
  res.json(extraLife.monitor.getRoster());
});

api.get('/member/:id', function(req, res){
  var member = extraLife.monitor.getMemberInfo(parseInt(req.params.id, 10));
  if(member){
    res.json(member);
  } else {
    res.sendStatus(404);
  }
});

module.exports = (app) => {
  app.use('/api', api);
};