import * as Networking from './networking';
import { AssetManager } from './asset_manager';
import * as Constants from '../shared/constants';

console.log('Client index.ts: ' + Constants.TEST_VALUE);

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
let assetManager = new AssetManager();

Promise.all([Networking.connect(), assetManager.downloadAssets()]).then(() => {
  //playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    console.log('click');
    // Play!
    //  play(usernameInput.value);
    //  playMenu.classList.add('hidden');
    //  initState();
    //  startCapturingInput();
    //  startRendering();
  };
});
