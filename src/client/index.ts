import './css/styles.css';

import { GeckosSocketHandler } from './network/geckos_socket_handler';
import { AssetManager } from './assets/asset_manager';
import { SpriteCache } from './assets/sprite_cache';
import { ClientWorldManager } from './client_world_manager';
import { InputReader } from './input/input_reader';
import { Camera } from './game/camera/camera';
import * as PIXI from 'pixi.js';
import { GameState } from './game/game_state';
import { ClientLevelManager } from './client_level_manager';
import { InputHistory } from './input/input_history';

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

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const renderer = new PIXI.Renderer({ view: canvas, clearBeforeRender: false });

camera.setSize({
  x: canvas.width,
  y: canvas.height,
});

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
      const roomNumber: number = 0;
      // TODO validate, store to gamestate afterjoin game reply ok
      const playerName: string = usernameInput.value;
      socketHandler.joinGame(playerName, roomNumber);
      gameState.setPlayerName(playerName);
      playMenu.classList.add('hidden');
    };
  });
});
