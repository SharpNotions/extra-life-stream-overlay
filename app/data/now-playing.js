const BaseData = require('./base-data');

const TITLE = Symbol('NowPlaying.title');
const GAME = Symbol('NowPlaying.game');

class NowPlaying extends BaseData {
  constructor(){
    super('now-playing.json', {
      title: 'Now Playing',
      game: 'Extra Life 2017'
    });
  }
  get title() { return this[TITLE]; }
  set title(value) {
    this[TITLE] = value;
    this.save();
  }
  get game() { return this[GAME]; }
  set game(value) {
    this[GAME] = value;
    this.save();
  }
  load(data){
    this.title = data.title;
    this.game = data.game;
  }
}

module.exports = new NowPlaying();