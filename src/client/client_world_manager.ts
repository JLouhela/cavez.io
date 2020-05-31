import { WorldManager } from '../shared/game/world_manager';
import { RenderSystem } from './rendering/render_system';
import { SpriteCache } from './assets/sprite_cache';
import { GameStateSystem } from './network/game_state_system';
import { GameState } from './game/game_state';
import { EntityFactory } from '../shared/game/entity/entity_factory';
import { InterpolateSystem } from './network/interpolate_system';
import { ClientPredictionSystem } from './network/client_prediction_system';

export class ClientWorldManager {
  private worldManager: WorldManager = null;
  private entityFactory: EntityFactory = null;

  constructor(spriteCache: SpriteCache, gameState: GameState) {
    this.worldManager = new WorldManager();
    this.entityFactory = new EntityFactory(this.worldManager.getWorld());
    this.initClientExtras(spriteCache, gameState);
  }

  public initClientExtras(spriteCache: SpriteCache, gameState: GameState) {
    this.worldManager
      .getWorld()
      .registerSystem(RenderSystem, { spriteCache, gameState })
      .registerSystem(GameStateSystem, {
        gameState,
        entityFactory: this.entityFactory,
        spriteCache,
      })
      .registerSystem(ClientPredictionSystem, { gameState })
      .registerSystem(InterpolateSystem, { gameState });
  }

  public start() {
    this.worldManager.client_start();
  }

  public stop() {
    this.worldManager.getWorld().stop();
  }
}
