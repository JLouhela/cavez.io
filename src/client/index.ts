import { SocketHandler } from './socket_handler';
import { AssetManager } from './asset_manager';
import * as Constants from '../shared/constants';

console.log('Client index.ts: ' + Constants.TEST_VALUE);

const playButton = document.getElementById('play-button');
const usernameInput = (
  document.getElementById('username-input')
) as HTMLInputElement;
const assetManager = new AssetManager();
const socketHandler = new SocketHandler();

Promise.all([socketHandler.connect(), assetManager.loadAssets()]).then(() => {
  // playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // TODO: display list of rooms to join, for now push all to room 0
    const roomNumber: number = 0;
    socketHandler.joinGame(usernameInput.value, roomNumber);
    //  playMenu.classList.add('hidden');
    //  initState();
    //  startCapturingInput();
    //  startRendering();
  };
});
