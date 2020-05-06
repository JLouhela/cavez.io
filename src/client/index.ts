import { SocketHandler } from './socket_handler';
import { AssetManager } from './asset_manager';
import * as Constants from '../shared/constants';

console.log('Client index.ts: ' + Constants.TEST_VALUE);

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const assetManager = new AssetManager();
const socketHandler = new SocketHandler();

Promise.all([socketHandler.connect(), assetManager.loadAssets()]).then(() => {
  // playMenu.classList.remove('hidden');
  console.log('TODO: Begin client loop');
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
