import { GeckosSocketHandler } from './network/geckos_socket_handler';
import { AssetManager } from './assets/asset_manager';
import { SpriteCache } from './assets/sprite_cache';
import { ClientWorldManager } from './client_world_manager';
import { InputReader } from './input/input_reader';
import { Camera } from './game/camera';
import * as PIXI from 'pixi.js';

import './css/styles.css';
import { GameState } from './game/game_state';

// TEST
import { LevelParser } from './game/level_parser';
import { Level } from '../shared/game/level';
import { AssetName } from './assets/asset_names';

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById(
  'username-input'
) as HTMLInputElement;
const playMenu = document.getElementById('play-menu') as HTMLDivElement;
const assetManager = new AssetManager();
const inputReader = new InputReader();
const camera = new Camera();

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

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const renderer = new PIXI.Renderer({ view: canvas });

camera.setSize({
  x: canvas.width,
  y: canvas.height,
});

Promise.all([assetManager.loadAssets()]).then(() => {
  Promise.all([
    (gameState = new GameState()),
    (socketHandler = new GeckosSocketHandler(gameState)),
    (spriteCache = new SpriteCache(assetManager)),
    (worldManager = new ClientWorldManager(
      spriteCache,
      gameState,
      inputReader,
      socketHandler,
      camera,
      renderer
    )),
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

      // TODO hook to joinGame -> receive current level -> init client side level
      // => remove test code and init level
      // => chunk updates later commit

      /// PARSER TEST
      const testParser = new LevelParser(renderer);
      const lvlid = spriteCache.createSprite(AssetName.LEVEL_1);
      const testSource = testParser.readPng(spriteCache.getSprite(lvlid));
      const testLevel = new Level(testSource);
      ////
      worldManager.start();
    };
  });
});
