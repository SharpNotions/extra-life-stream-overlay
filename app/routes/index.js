'use strict';

function siteIndex(app){
  app.get('/', (req,res) => {
    res.render('index', {title: 'Streaming Central!'});
  });
}

module.exports = siteIndex;
