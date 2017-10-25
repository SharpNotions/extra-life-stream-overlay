const fs = require('fs');
const path = require('path');

const copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    let cbCalled = false;
    const done = err => {
      if(!cbCalled){
        cbCalled = true;
        err ? reject(err) : resolve();
      }
    };

    const rd = fs.createReadStream(source);
    rd.on('error', err => done(err));

    const wr = fs.createWriteStream(target);
    wr.on('err', err => done(err));
    wr.on('close', () => done());

    rd.pipe(wr);
  });
};

const copyFiles = (source, target) => {
  if(source instanceof Array){
    const promises = source.map(file => {
      return copyFile(file, path.join(target, path.basename(file)));
    });
    return Promise.all(promises);
  } else {
    return copyFile(source, target);
  }
};

module.exports = copyFiles;