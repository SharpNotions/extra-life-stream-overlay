const express = require('express');
const extraLife = require('../../el');

const api = express.Router();

api.get('/team', (req, res) => {
  res.json(extraLife.monitor.getTeamInfo());
});

api.get('/roster', (req, res) => {
  res.json(extraLife.monitor.getRoster());
});

api.get('/member/:id', (req, res) => {
  const member = extraLife.monitor.getMemberInfo(parseInt(req.params.id, 10));
  if(member){
    res.json(member);
  } else {
    res.sendStatus(404);
  }
});

module.exports = (app) => {
  app.use('/api', api);
};
