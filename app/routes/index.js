'use strict';

function siteIndex(app){
  app.get('/', function(req,res){
    res.render('index', {title: 'Streaming Central!'});
  });
}

module.exports = siteIndex;