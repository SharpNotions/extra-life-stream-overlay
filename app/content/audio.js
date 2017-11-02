(function (io) {
'use strict';

io = io && io.hasOwnProperty('default') ? io['default'] : io;

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

var audio = new AudioPlayer();

const socket = io('/public');

socket.on('connect', () => {
  console.log(`[Socket] ${socket.id} connected`);
  socket.emit('join', { room: 'audio' }, (response) => {
    if(response.success){
      console.info('[Socket]', response.result);
    } else {
      console.warn('[Socket] could not join room audio', response.result);
    }
  });
});
socket.on('disconnect', () => console.log(`[Socket] ${socket.id} disconnected`));

document.onreadystatechange = () => {
  if(document.readyState === 'interactive'){
    socket.on('play-audio', (data) => {
      if(data.file){
        audio.play(`/content/audio/${data.file}`);
      } else {
        console.warn('[Socket] data has no file property:', data);
      }
    });
  }
};

}(io));
