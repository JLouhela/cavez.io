import { World } from 'ecsy';

import { RenderSystem } from '../../client/rendering/render_system';
import { SpriteCache } from '../../client/assets/sprite_cache';

export class WorldManager {
  private world: World = null;

  constructor() {
    this.world = new World();
    this.initCommon();
  }

  private initCommon() {
    console.log('init common: NOT IMPLEMENTED');
  }

  public initClientExtras(spriteCache: SpriteCache) {
    this.world.registerSystem(RenderSystem, { spriteCache });
  }

  public getWorld(): World {
    return this.world;
  }

  public start(): void {
    function step() {
      const time = performance.now();
      const delta = time - lastTime;

      // Run all the systems
      world.execute(delta, time);
      lastTime = time;
      requestAnimationFrame(step);
    }
    let lastTime = performance.now();
    let world = this.world;
    step();
  }
}
