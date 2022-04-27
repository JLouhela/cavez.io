import { LevelParser } from './game/level_parser.js';
import { Level } from '../shared/game/level/level.js';
import { AssetName } from './assets/asset_names.js';
import { AssetManager } from './assets/asset_manager.js';
import { Levels } from '../shared/levels.js';
import { ILevelProvider } from '../shared/game/level/level_provider_interface.js';
import * as PIXI from 'pixi.js';

export class ClientLevelManager implements ILevelProvider {
  private currentLevel: Level;
  private currentLevelName: string;
  private levelParser: LevelParser = null;
  private assetManager: AssetManager = null;
  private levelNameMapping: { [levelName: string]: AssetName } = {};

  constructor(renderer: PIXI.Renderer, assetManager: AssetManager) {
    this.levelParser = new LevelParser(renderer);
    this.assetManager = assetManager;
    this.initMapping();
  }

  private initMapping() {
    this.levelNameMapping[Levels.LEVEL_1] = AssetName.LEVEL_1;
  }

  public loadLevel(lvlName: string) {
    const lvlSource = this.levelParser.readPng(
      new PIXI.Sprite(this.assetManager.getTexture(lvlName))
    );
    this.currentLevel = new Level(lvlSource);
    console.log('Level ' + lvlName + ' loaded successfully');
  }

  get levelName(): string {
    return this.currentLevelName;
  }

  getLevel(): Level {
    return this.currentLevel;
  }
}
