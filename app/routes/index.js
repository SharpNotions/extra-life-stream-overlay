'use strict';

function siteIndex(app){
  app.get('/', (req,res) => {
    res.render('index', {title: 'Streaming Central!'});
  });
  app.get('/control', (req,res) => {
    res.render('control');
  });
  app.get('/audio', (req,res) => {
    res.render('audio');
  });
}

module.exports = siteIndex;
