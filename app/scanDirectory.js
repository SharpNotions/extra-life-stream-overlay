'use strict';
var fs = require('fs');
var path = require('path');

function scanDirectory(dirPath, files, extension){
  if(!files) files = [];
  if(!extension) extension = '.js';
  fs.readdirSync(dirPath).forEach(file => {
    var fullPath = path.join(dirPath, file);
    var stat = fs.statSync(fullPath);
    if(stat.isDirectory()){
      scanDirectory(fullPath, files, extension);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

module.exports = scanDirectory;