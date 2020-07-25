import { IVec2 } from '../../shared/math/vector';
import { Level } from '../../shared/game/level';
import { LevelSource } from '../../shared/game/level_source';
import { Levels } from '../../shared/levels';
import * as LevelParser from '../utils/level_parser';

export class ServerLevelManager {
  private currentLevel: Level;
  private currentLevelName: string;
  private levelNameMapping: { [levelName: string]: string } = {};

  constructor() {
    this.initMapping();
    this.currentLevelName = Levels.LEVEL_1;
  }

  public loadLevel() {
    const levelLoadPromise = new Promise((resolve) => {
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

  get level(): Level {
    return this.currentLevel;
  }
}
