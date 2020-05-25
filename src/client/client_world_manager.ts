import { WorldManager } from '../shared/game/world_manager';
import { RenderSystem } from './rendering/render_system';
import { SpriteCache } from './assets/sprite_cache';
import { ClientSyncSystem } from './network/client_sync_system';
import { GameState } from './game/game_state';
import { EntityFactory } from '../shared/game/entity/entity_factory';

export class ClientWorldManager {
  private worldManager: WorldManager = null;
  private entityFactory: EntityFactory = null;

  constructor(spriteCache: SpriteCache, gameState: GameState) {
    this.worldManager = new WorldManager();
    this.entityFactory = new EntityFactory(this.worldManager.getWorld());
    this.initClientExtras(spriteCache, gameState);
  }

  public initClientExtras(spriteCache: SpriteCache, gameState: GameState) {
    this.worldManager.getWorld().registerSystem(RenderSystem, { spriteCache });
    this.worldManager.getWorld().registerSystem(ClientSyncSystem, {
      gameState,
      entityFactory: this.entityFactory,
    });
  }

  public start() {
    this.worldManager.client_start();
  }
}
