import nowPlaying from './now-playing';
import webcam from './webcam';
import testDonation from './test-donation';
import audio from './audio';
import socket from './sockets';

const views = {
  socket: socket
};

document.onreadystatechange = () => {
  if(document.readyState === 'interactive'){
    views.nowPlaying = nowPlaying();
    views.webcam = webcam();
    views.testDonation = testDonation();
    views.audio = audio();
  }
};

export default views;