import * as PIXI from 'pixi.js';
import { AssetManager } from './asset_manager';

export class SpriteCache {
  private assetManager: AssetManager = null;
  private sprites: { [spriteId: number]: PIXI.Sprite } = {};
  private nextId: number = 0;
  private releasedIds: number[] = [];

  constructor(assetManager: AssetManager) {
    this.assetManager = assetManager;
  }

  // Return id of stored sprite
  public createSpriteFromTexture(texture: PIXI.Texture): number {
    const id =
      this.releasedIds.length > 0 ? this.releasedIds.pop() : this.nextId++;
    this.sprites[id] = new PIXI.Sprite(texture);
    this.sprites[id].pivot.set(
      this.sprites[id].width / 2,
      this.sprites[id].height / 2
    );
    return id;
  }

  // Return id of stored sprite
  public createSprite(assetName: string): number {
    return this.createSpriteFromTexture(
      this.assetManager.getTexture(assetName)
    );
  }

  public releaseSprite(id: number) {
    this.sprites[id] = null;
    this.releasedIds.push(id);
  }

  public getSprite(id: number): PIXI.Sprite {
    return this.sprites[id];
  }

  public getAssetManager(): AssetManager {
    return this.assetManager;
  }
}
