import { World } from 'ecsy';
import * as Constants from './../constants';

// Server and client inherits
// This is to avoid dependency leaking (e.g. pixi) to server
export class WorldManager {
  private world: World = null;

  constructor() {
    this.world = new World();
    this.initCommon();
  }

  private initCommon() {
    console.log('init common: NOT IMPLEMENTED');
  }

  public getWorld(): World {
    return this.world;
  }

  public client_start(): void {
    function client_step() {
      const time = performance.now();
      const delta = time - lastTime;

      // Run all the systems
      world.execute(delta, time);
      lastTime = time;
      requestAnimationFrame(client_step);
    }
    let lastTime = performance.now();
    const world = this.world;
    client_step();
  }

  public server_start(tickCallback: (deltaTime: number) => void): void {
    function server_step() {
      const time = performance.now();
      const updateDelta = time - lastWorldUpdate;
      const tickDelta = time - lastTick;

      if (updateDelta > Constants.SERVER_WORLD_STEP_RATE) {
        world.execute(updateDelta, time);
        lastWorldUpdate = time;
      }
      if (tickDelta > Constants.SERVER_TICK_RATE) {
        tickCallback(tickDelta);
        lastTick = time;
      }
      setImmediate(server_step);
    }
    let lastTick = performance.now();
    let lastWorldUpdate = performance.now();
    const world = this.world;
    server_step();
  }
}
