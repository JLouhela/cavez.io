import { LevelSource, Pixel } from './level_source.js';
import * as Terrain from './terrain_utils.js';
import { IVec2 } from '../../math/vector.js';
import * as MathUtils from '../../math/math_utils.js';

export class Level {
  private width: number;
  private height: number;
  private bucketSize: number;
  // Inefficient for now: level data contains raw data
  private levelData: { [bucket: number]: Terrain.TerrainType[] } = {};
  // CollisionData contains compressed format
  private collisionData: { [bucket: number]: number[] } = {};

  constructor(source: LevelSource) {
    this.width = source.width;
    this.height = source.height;
    // Level size must match bucket size
    this.bucketSize = 128;
    console.log('Initializing level..');
    this.initBuckets();
    console.log('Buckets initialized for level');
    this.fillBuckets(source.pixelData);
    console.log('Buckets prepared for level');
  }

  private getHash(x: number, y: number): number {
    // TODO multiply by x instead of str manipulation
    return parseInt(
      Math.floor(y / this.bucketSize).toString() +
        Math.floor(x / this.bucketSize).toString(),
      10
    );
  }

  private initBuckets() {
    for (let i = 0; i < this.width * this.height; i += this.bucketSize) {
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      const hash = this.getHash(x, y);
      if (!(hash in this.levelData)) {
        this.levelData[hash] = [];
      }
      if (!(hash in this.collisionData)) {
        this.collisionData[hash] = [];
        // Zero init collision data: width compressed, single integer holds 32 pixels
        for (let c = 0; c < (this.bucketSize / 32) * this.bucketSize; ++c) {
          this.collisionData[hash].push(0);
        }
      }
    }
  }

  private fillBuckets(pixelData: Pixel[]) {
    for (let i = 0; i < this.width * this.height; ++i) {
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      const hash = this.getHash(x, y);
      if (!(hash in this.levelData)) {
        this.levelData[hash] = [];
      }
      if (!(hash in this.collisionData)) {
        this.collisionData[hash] = [];
      }
      const terrainType = Terrain.getTerrainType(pixelData[i]);
      this.levelData[hash].push(terrainType);
      this.addCollisionData(i, hash, terrainType);
    }
  }

  private addCollisionData(
    idx: number,
    hash: number,
    type: Terrain.TerrainType
  ) {
    if (type === Terrain.TerrainType.None) {
      return;
    }
    const numIdx = Math.floor(idx / 32);
    const bitIndex = Math.floor(idx % 32);
    this.collisionData[hash][numIdx] |= 1 << bitIndex;
  }

  public isSolid(c: IVec2) {
    const x = MathUtils.wrap(Math.floor(c.x), this.width);
    const y = MathUtils.wrap(Math.floor(c.y), this.height);
    const idx = x + y * this.width;
    const numIdx = Math.floor(idx / 32);
    const bitIndex = idx % 32;
    const hash = this.getHash(x, y);
    return (this.collisionData[hash][numIdx] & (1 << bitIndex)) > 0;
  }
}
