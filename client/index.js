// overlay index
import currentStars from './current-stars';
import donationNotification from './donation-notification';
import progressBar from './progress-bar';
import roster from './roster';
import timers from './timers';

const views = {};

document.onreadystatechange = () => {
  if(document.readyState === 'interactive'){
    views.topInfo = currentStars();
    views.notification = donationNotification();
    views.donationProgress = progressBar();
    views.roster = roster();
    views.timers = timers();
  }
  document.onreadystatechange = () => {};
}

export default views;