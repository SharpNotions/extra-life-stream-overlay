require('dotenv').config();

const get = (setting) => {
  return process.env.hasOwnProperty(setting) ? process.env[setting] : null;
};

const cfg = {
  /**
   * Get an ENV variable as a float
   * @param {string} setting - the setting to retrieve
   * @param {number} [dflt] - the default value, default 0
   * @return {number} the parsed value, or the default
   */
  asFloat: (setting, dflt) => {
    if(dflt == null) dflt = 0;
    const result = parseFloat(get(setting));
    return isNaN(result) ? dflt : result;
  },
  /**
   * Get an ENV variable as an integer
   * @param {string} setting - the setting to retrieve
   * @param {number} [dflt] - the default value, default 0
   * @returns {number} the parsed value, or the default
   */
  asInt: (setting, dflt) => {
    if(dflt == null) dflt = 0;
    const result = parseInt(get(setting), 10);
    return isNaN(result) ? dflt : result;
  },
  /**
   * Get an ENV variable as a boolean
   * @param {string} setting - the setting to retrieve
   * @param {boolea} [dflt] - the default value, default false
   * @returns {boolean}
   */
  asBool: (setting, dflt) => {
    if(get(setting)){
      const val = (get(setting) || '').toString().toLowerCase();
      switch(val){
        case 't':
        case 'true':
        case '1':
          return true;
        case 'f':
        case 'false':
        case '0':
          return false;
        default:
          return !!dflt;
      }
    } else {
      return !!dflt;
    }
  }
};

for(let setting in process.env){
  cfg[setting] = process.env[setting];
}


module.exports = Object.freeze(cfg);