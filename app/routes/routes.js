'use strict';

var scanDirectory = require('../scanDirectory');

function routes(app){
  scanDirectory(__dirname).forEach(file => {
    if(file !== __filename){
      require(file)(app);
    }
  });
}

module.exports = routes;