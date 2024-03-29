import { IVec2 } from '../../shared/math/vector.js';
import { Level } from '../../shared/game/level/level.js';
import { LevelSource } from '../../shared/game/level/level_source.js';
import { Levels } from '../../shared/levels.js';
import * as LevelParser from '../utils/level_parser.js';
import { ILevelProvider } from '../../shared/game/level/level_provider_interface.js';

export class ServerLevelManager implements ILevelProvider {
  private currentLevel: Level;
  private currentLevelName: string;
  private levelNameMapping: { [levelName: string]: string } = {};

  constructor() {
    this.initMapping();
    this.currentLevelName = Levels.LEVEL_1;
  }

  public loadLevel() {
    const levelLoadPromise = new Promise<void>((resolve) => {
      LevelParser.readPng(this.levelNameMapping[this.currentLevelName])
        .then((result) => {
          return new Promise(() => {
            this.initLevel(result);
            resolve();
          });
        })
        .catch(() => console.error(`Failed to read png from ${this.levelNameMapping[this.currentLevelName]}`));
    });
    return levelLoadPromise;
  }

  private initLevel(source: LevelSource) {
    this.currentLevel = new Level(source);
    console.log('Level initialized');
  }

  private initMapping() {
    this.levelNameMapping[Levels.LEVEL_1] = './public/assets/level_1.png';
  }

  public getSpawnPoint(): IVec2 {
    // TODO level bounds + collision avoidance
    return { x: Math.random() * 300, y: Math.random() * 300 };
  }

  get levelName(): string {
    return this.currentLevelName;
  }

  getLevel(): Level {
    return this.currentLevel;
  }
}
