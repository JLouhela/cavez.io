import * as Networking from './networking';
import * as Constants from '../shared/constants';

console.log('Client index.ts: ' + Constants.TEST_VALUE);

Promise.all([
  Networking.connect(),
  // downloadAssets(),
]).then(() => {
  //playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    //  play(usernameInput.value);
    //  playMenu.classList.add('hidden');
    //  initState();
    //  startCapturingInput();
    //  startRendering();
  };
});
