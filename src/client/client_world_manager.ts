import { WorldManager } from '../shared/game/world_manager';
import { RenderSystem } from './rendering/render_system';
import { SpriteCache } from './assets/sprite_cache';
import { ClientSyncSystem } from './network/client_sync_system';
import { GameState } from './game/game_state';

export class ClientWorldManager {
  private worldManager: WorldManager = null;
  constructor(spriteCache: SpriteCache, gameState: GameState) {
    this.worldManager = new WorldManager();
    this.initClientExtras(spriteCache, gameState);
  }

  public initClientExtras(spriteCache: SpriteCache, gameState: GameState) {
    this.worldManager.getWorld().registerSystem(RenderSystem, { spriteCache });
    this.worldManager
      .getWorld()
      .registerSystem(ClientSyncSystem, { gameState });
  }

  public spawnPlayer() {
    console.log('empty implementation spawnPlayer');
  }

  public start() {
    this.worldManager.client_start();
  }
}
