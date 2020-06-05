import { GeckosSocketHandler } from './network/geckos_socket_handler';
import { AssetManager } from './assets/asset_manager';
import { SpriteCache } from './assets/sprite_cache';
import { ClientWorldManager } from './client_world_manager';
import { InputReader } from './input/input_reader';

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
const spriteCache = new SpriteCache(assetManager);
const inputReader = new InputReader();

document.addEventListener('keydown', (event) =>
  inputReader.keyDownEventListener(event)
);
document.addEventListener('keyup', (event) =>
  inputReader.keyUpEventListener(event)
);

const worldManager = new ClientWorldManager(
  spriteCache,
  gameState,
  inputReader,
  socketHandler
);

Promise.all([
  socketHandler.connect(worldManager),
  assetManager.loadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // TODO: display list of rooms to join, for now push all to room 0
    const roomNumber: number = 0;
    // TODO validate, store to gamestate afterjoin game reply ok
    const playerName: string = usernameInput.value;
    socketHandler.joinGame(playerName, roomNumber);
    gameState.setPlayerName(playerName);
    playMenu.classList.add('hidden');
    worldManager.start();
    //  initState();
    //  startCapturingInput();
    //  startRendering();
  };
});
