import nowPlaying from './now-playing';
import webcam from './webcam';
import testDonation from './test-donation';

const views = {};

document.onreadystatechange = () => {
  if(document.readyState === 'interactive'){
    views.nowPlaying = nowPlaying();
    views.webcam = webcam();
    views.testDonation = testDonation();
  }
};

export default views;