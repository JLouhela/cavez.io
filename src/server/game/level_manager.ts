import { IVec2 } from '../../shared/math/vector';

export class LevelManager {
  // TODO decide how to build level => shared code
  public getSpawnPoint(): IVec2 {
    return { x: Math.random() * 300, y: Math.random() * 300 };
  }
}
