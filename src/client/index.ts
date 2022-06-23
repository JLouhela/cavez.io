import './css/styles.css';

import { GeckosSocketHandler } from './network/geckos_socket_handler.js';
import { AssetManager } from './assets/asset_manager.js';
import { SpriteCache } from './assets/sprite_cache.js';
import { ClientWorldManager } from './client_world_manager.js';
import { InputReader } from './input/input_reader.js';
import { Camera } from './game/camera/camera.js';
import * as PIXI from 'pixi.js';
import { GameState } from './game/game_state.js';
import { ClientLevelManager } from './client_level_manager.js';
import { InputHistory } from './input/input_history.js';

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById(
  'username-input'
) as HTMLInputElement;
const playMenu = document.getElementById('play-menu') as HTMLDivElement;
const assetManager = new AssetManager();
const inputReader = new InputReader();
const camera = new Camera();
const inputHistory: InputHistory = new InputHistory(20);

document.addEventListener('keydown', (event) =>
  inputReader.keyDownEventListener(event)
);
document.addEventListener('keyup', (event) =>
  inputReader.keyUpEventListener(event)
);

let gameState: GameState = null;
let socketHandler: GeckosSocketHandler = null;
let spriteCache: SpriteCache = null;
let worldManager: ClientWorldManager = null;
let levelManager: ClientLevelManager = null;

const calculateScreenSize = (): { 'width': number, 'height': number } => {
  const targetWidth = 1920;
  const targetHeight = 1080;
  const widthToHeight = targetWidth / targetHeight;
  // TODO instead, use the full innerwidth / innerheight but scale the content
  // -> requires scale handling to camera 
  let newWidth = window.innerWidth > targetWidth ? targetWidth : window.innerWidth;
  let newHeight = window.innerHeight > targetHeight ? targetHeight : window.innerHeight;
  const newWidthToHeight = newWidth / newHeight;

  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
  } else {
    newHeight = newWidth / widthToHeight;
  }

  return { width: newWidth, height: newHeight }
}

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const body = document.body as HTMLBodyElement;
const initScreenSize = calculateScreenSize();
const renderer = new PIXI.Renderer({
  view: canvas,
  clearBeforeRender: false,
  width: initScreenSize.width,
  height: initScreenSize.height
});

camera.setSize({
  x: canvas.width,
  y: canvas.height,
});

body.onresize = (ev: UIEvent) => {
  const screenSize = calculateScreenSize();
  renderer.resize(screenSize.width, screenSize.height);
  camera.setSize({
    x: canvas.width,
    y: canvas.height,
  });
}

Promise.all([assetManager.loadAssets()]).then(() => {
  Promise.all([
    (gameState = new GameState()),
    (spriteCache = new SpriteCache(assetManager)),
    (levelManager = new ClientLevelManager(renderer, assetManager)),
    (socketHandler = new GeckosSocketHandler(gameState, levelManager)),
    (worldManager = new ClientWorldManager(
      spriteCache,
      gameState,
      inputReader,
      socketHandler,
      camera,
      renderer,
      levelManager,
      inputHistory
    )),
    // Cyclic dependency: SocketHandler takes responsibility of worldmanager:
    // - Startup before spawn request
    // - Teardown on disconnect
    // SocketHandler also provides emiter interface for worldManager
    //  => TODO refactor before painful
    socketHandler.connect(worldManager),
  ]).then(() => {
    playMenu.classList.remove('hidden');
    usernameInput.focus();
    playButton.onclick = () => {
      // TODO: display list of rooms to join, for now push all to room 0
      const roomId = "0";
      // TODO validate, store to gamestate afterjoin game reply ok
      const playerName: string = usernameInput.value;
      socketHandler.joinGame(playerName, roomId);
      gameState.setPlayerName(playerName);
      playMenu.classList.add('hidden');
    };
  }).catch((error: Error) => { console.error(`Failed to connect to server: ${error.message}`) });
}).catch((error: Error) => { console.error(`Failed to setup game: ${error.message}`) });
