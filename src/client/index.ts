import { GeckosSocketHandler } from './network/geckos_socket_handler';
import { AssetManager } from './assets/asset_manager';
import { SpriteCache } from './assets/sprite_cache';
import { ClientWorldManager } from './client_world_manager';

import './css/styles.css';
import { GameState } from './game/game_state';

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById(
  'username-input'
) as HTMLInputElement;
const playMenu = document.getElementById('play-menu') as HTMLDivElement;
const assetManager = new AssetManager();
const gameState = new GameState();
const socketHandler = new GeckosSocketHandler(gameState);
const spriteCache = new SpriteCache();
const worldManager = new ClientWorldManager(spriteCache, gameState);

Promise.all([socketHandler.connect(), assetManager.loadAssets()]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // TODO: display list of rooms to join, for now push all to room 0
    const roomNumber: number = 0;
    socketHandler.joinGame(usernameInput.value, roomNumber);
    playMenu.classList.add('hidden');
    worldManager.start();
    //  initState();
    //  startCapturingInput();
    //  startRendering();
  };
});
