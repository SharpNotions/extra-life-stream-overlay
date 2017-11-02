import audio from './audio';
import socket from './socket';

document.onreadystatechange = () => {
  if(document.readyState === 'interactive'){
    socket.on('play-audio', (data) => {
      if(data.file){
        audio.play(`/content/audio/${data.file}`);
      } else {
        console.warn('[Socket] data has no file property:', data);
      }
    })
  }
};