'use strict';

var scanDirectory = require('../scanDirectory');

const routes = (app) => {
  scanDirectory(__dirname).forEach(file => {
    if(file !== __filename){
      require(file)(app);
    }
  });
}

module.exports = routes;
