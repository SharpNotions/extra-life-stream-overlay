class AudioPlayer {
  constructor(){
    this.files = new Map();
    this.context = new AudioContext();
  }
  getBuffer(url){
    const thePromise = new Promise((resolve, reject) => {
      if(this.files.has(url)){
        resolve(this.files.get(url));
      } else {
        var req = new XMLHttpRequest();
        req.addEventListener('load', () => {
          this.context.decodeAudioData(req.response, (audioData) => {
            if(!audioData){
              reject('Audio decoder error');
            } else {
              this.files.set(url, audioData);
              resolve(audioData);
            }
          });
        });
        req.addEventListener('error', () => reject('HTTP error'));
        req.responseType = 'arraybuffer';
        req.open('GET', url, true);
        req.send();
      }
    });
    if(!this.files.has(url)){
      this.files.set(url, thePromise);      
    }
    return thePromise;
  }
  play(url){
    this.getBuffer(url).then(
      audio => {
        const src = this.context.createBufferSource();
        src.buffer = audio;
        src.connect(this.context.destination);
        src.start(0);
      }, err => {
        console.error(`[Audio] ${err}`);
      }
    );
  }
}

export default new AudioPlayer();