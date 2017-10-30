const BaseData = require('./base-data');
const DISABLED = Symbol('Webcam.disabled');

class WebcamData extends BaseData{
  constructor(){
    super('webcam', {
      disabled: false
    });
  }
  load(data){
    this.disabled = data.disabled;
  }
  get disabled() { return this[DISABLED]; }
  set disabled(value) {
    this[DISABLED] = !!value;
    this.save();
  }
}

module.exports = new WebcamData();