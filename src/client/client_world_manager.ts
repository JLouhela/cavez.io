import { WorldManager } from '../shared/game/world_manager';
import { RenderSystem } from './rendering/render_system';
import { SpriteCache } from './assets/sprite_cache';

export class ClientWorldManager {
  private worldManager: WorldManager = null;
  constructor(spriteCache: SpriteCache) {
    this.worldManager = new WorldManager();
    this.initClientExtras(spriteCache);
    this.worldManager.client_start();
  }

  public initClientExtras(spriteCache: SpriteCache) {
    this.worldManager.getWorld().registerSystem(RenderSystem, { spriteCache });
  }

  public spawnPlayer() {
    console.log('empty implementation spawnPlayer');
  }

  public start() {
    this.worldManager.client_start();
  }
}
