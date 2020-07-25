import { LevelParser } from './game/level_parser';
import { Level } from '../shared/game/level';
import { AssetName } from './assets/asset_names';
import { SpriteCache } from './assets/sprite_cache';
import { Levels } from '../shared/levels';

export class ClientLevelManager {
  private currentLevel: Level;
  private currentLevelName: string;
  private levelParser: LevelParser = null;
  private spriteCache: SpriteCache = null;
  private levelNameMapping: { [levelName: string]: AssetName } = {};

  constructor(renderer: PIXI.Renderer, spriteCache: SpriteCache) {
    this.levelParser = new LevelParser(renderer);
    this.spriteCache = spriteCache;
    this.initMapping();
  }

  private initMapping() {
    this.levelNameMapping[Levels.LEVEL_1] = AssetName.LEVEL_1;
  }

  public loadLevel(lvlName: string) {
    const lvlSpriteId = this.spriteCache.createSprite(
      this.levelNameMapping[lvlName]
    );
    const lvlSource = this.levelParser.readPng(
      this.spriteCache.getSprite(lvlSpriteId)
    );
    this.currentLevel = new Level(lvlSource);
    console.log('Level ' + lvlName + ' loaded successfully');
  }

  get levelName(): string {
    return this.currentLevelName;
  }

  get level(): Level {
    return this.currentLevel;
  }
}
