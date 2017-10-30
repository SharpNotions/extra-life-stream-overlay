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
        this.files.set(url, thePromise);
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';
        req.onload = () => {
          this.context.decodeAudioData(req.response, (audioData) => {
            if(!audioData){
              reject('Audio decoder error');
            } else {
              this.files.set(url, audioData);
              resolve(audioData);
            }
          });
        };
        req.onerror = () => {
          reject('HTTP error');
        }
      }
    });
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