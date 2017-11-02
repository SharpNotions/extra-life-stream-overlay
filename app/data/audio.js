const fs = require('fs');
const path = require('path');
const EventDispatcher = require('events');

const audioFolder = path.resolve(__dirname, '../content/audio/');

const props = {
  files: Symbol('Audio.files')
}

class Audio extends EventDispatcher {
  /**
   * Keeps track of audio files on the server
   * @constructs Audio
   */
  constructor(){
    super();
    this[props.files] = [];
    fs.readdir(audioFolder, (err, files) => {
      this[props.files].push(...files);
    });
  }
  /**
   * @prop {string[]} files - known files
   * @memberof Audio
   */
  get files() {
    return this[props.files].concat();
  }
  /**
   * Move an uploaded file to the destination
   * @param {string} sourcePath - the original file
   * @param {string} filename - the desired filename
   * @returns {Promis<string>}
   */
  fileUploaded(sourcePath, filename){
    return new Promise((resolve, reject) => {
      const destFile = path.join(audioFolder, filename);
      if(fs.existsSync(destFile)){
        fs.unlinkSync(sourcePath);
        reject('A file with the uploaded filename already exists.');
      } else {
        fs.rename(sourcePath, destFile, (err) => {
          if(err) {
            reject(err);
          } else {
            this[props.files].push(filename);
            this.emit('add', filename);
            resolve(filename);
          }
        });
      }
    });
  }
}

module.exports = new Audio();