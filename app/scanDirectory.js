'use strict';
const fs = require('fs');
const path = require('path');

function scanDirectory(dirPath, files, extension){
  if(!files) files = [];
  if(!extension) extension = '.js';
  fs.readdirSync(dirPath).forEach(file => {
    let fullPath = path.join(dirPath, file);
    let stat = fs.statSync(fullPath);
    if(stat.isDirectory()){
      scanDirectory(fullPath, files, extension);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

module.exports = scanDirectory;
