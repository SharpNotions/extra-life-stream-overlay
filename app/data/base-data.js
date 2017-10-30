const fs = require('fs');
const path = require('path');

const TIMER = Symbol('BaseData.timer');
const DATATYPE = Symbol('BaseData.datafile');
const FILENAME = Symbol('BaseData.filename');
const CANSAVE = Symbol('BaseData.cansave');
const DEFAULTS = Symbol('BaseData.defaults');

const saveData = (datafile, data) => {
  fs.writeFile(datafile, data, (err) =>{
    if(err){
      console.warn(`Could not persist to ${datafile} due to ${err}`);
    } else {
      console.info(`Wrote ${datafile} to disk.`);
    }
  });
};

class BaseData {
  constructor(datafile, defaults){

    this[TIMER] = null;
    this[CANSAVE] = false;
    this[DATATYPE] = datafile;
    this[DEFAULTS] = defaults;

    this[FILENAME] = path.resolve(__dirname, datafile.endsWith('.json') ? datafile : datafile + '.json')

    try{
      if(fs.existsSync(this[FILENAME])){
        const contents = fs.readFileSync(this[FILENAME], {encoding:'utf8'});
        const data = JSON.parse(contents);
        Object.keys(defaults).forEach(key => {
          if(!data.hasOwnProperty(key)){
            data[key] = defaults[key];
          }
        });
        this.load(data);
      } else {
        this.load(defaults);
      }
    } catch(err){
      console.warn('[BaseData]:', err);
    }
    this[CANSAVE] = true;
  }
  load(data){
    console.warn('BaseData.load not overridden in ' + this[DATATYPE]);
  }
  save(){
    if(this[CANSAVE]){
      if(this[TIMER] != null){
        clearTimeout(this[TIMER]);
      }
      this[TIMER] = setTimeout(() => {
        saveData(this[FILENAME], JSON.stringify(this));
        this[TIMER] = null;
      }, 100);
    }
  }
  toJSON(){
    const result = {};
    Object.keys(this[DEFAULTS]).forEach(key => {
      result[key] = this[key];
    });
    return result;
  }
}

module.exports = BaseData;