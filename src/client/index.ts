import { GeckosSocketHandler } from './network/geckos_socket_handler';
import { AssetManager } from './assets/asset_manager';
import { GameRenderer } from './rendering/game_renderer';

// Not state of the art way, but should be sufficient for this game.
import './css/styles.css';

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById(
  'username-input'
) as HTMLInputElement;
const playMenu = document.getElementById('play-menu') as HTMLDivElement;
const assetManager = new AssetManager();

const socketHandler = new GeckosSocketHandler();
const gameRenderer = new GameRenderer();

Promise.all([socketHandler.connect(), assetManager.loadAssets()]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // TODO: display list of rooms to join, for now push all to room 0
    const roomNumber: number = 0;
    socketHandler.joinGame(usernameInput.value, roomNumber);
    playMenu.classList.add('hidden');
    gameRenderer.init();
    //  initState();
    //  startCapturingInput();
    //  startRendering();
  };
});
