'use strict';
const fs = require('fs');
const path = require('path');

function scanDirectory(dirPath, files, extension, deep){
  if(!files) files = [];
  if(!extension) extension = '.js';
  if(deep == null) deep = true;
  
  if(!fs.existsSync(dirPath)){
    return files;
  }

  fs.readdirSync(dirPath).forEach(file => {
    let fullPath = path.join(dirPath, file);
    let stat = fs.statSync(fullPath);
    if(stat.isDirectory()){
      if(deep){
        scanDirectory(fullPath, files, extension, deep);
      }
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

module.exports = scanDirectory;
