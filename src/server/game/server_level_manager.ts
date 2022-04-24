import { IVec2 } from '../../shared/math/vector';
import { Level } from '../../shared/game/level/level';
import { LevelSource } from '../../shared/game/level/level_source';
import { Levels } from '../../shared/levels';
import * as LevelParser from '../utils/level_parser';
import { ILevelProvider } from '../../shared/game/level/level_provider_interface';

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
      const self = this;
      LevelParser.readPng(this.levelNameMapping[this.currentLevelName])
        .then((result) => {
          return new Promise(() => {
            self.initLevel(result);
            resolve();
          });
        })
        .catch((error) => console.log(error.message));
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
