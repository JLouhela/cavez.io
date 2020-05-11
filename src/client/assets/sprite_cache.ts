import * as PIXI from 'pixi.js';

export class SpriteCache {
  private sprites: { [spriteId: number]: PIXI.Sprite } = {};
  private nextId: number = 0;
  private releasedIds: number[] = [];

  // Return id of stored sprite
  createSprite(texture: PIXI.Texture): number {
    const id =
      this.releasedIds.length > 0 ? this.releasedIds.pop() : this.nextId++;
    this.sprites[id] = new PIXI.Sprite(texture);
    return id;
  }

  releaseSprite(id: number) {
    this.sprites[id] = null;
    this.releasedIds.push(id);
  }

  getSprite(id: number): PIXI.Sprite {
    return this.sprites[id];
  }
}
