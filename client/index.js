// overlay index
import currentStars from './current-stars';
import donationNotification from './donation-notification';
import progressBar from './progress-bar';
import roster from './roster';
import timers from './timers';
import sockets from './sockets';
import nowPlaying from './now-playing';

const views = {};

document.onreadystatechange = () => {
  if(document.readyState === 'interactive'){
    document.onreadystatechange = null;
  
    views.topInfo = currentStars();
    views.notification = donationNotification();
    views.donationProgress = progressBar();
    views.roster = roster();
    views.timers = timers();
    views.nowPlaying = nowPlaying();

    sockets(views);
  }
}

export default views;