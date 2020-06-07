import { WorldManager } from '../shared/game/world_manager';
import { RenderSystem } from './rendering/render_system';
import { SpriteCache } from './assets/sprite_cache';
import { EntityInitSystem } from './network/entity_init_system';
import { GameState } from './game/game_state';
import { EntityFactory } from '../shared/game/entity/entity_factory';
import { InterpolateSystem } from './network/interpolate_system';
import { ClientCorrectionSystem } from './network/client_correction_system';
import { EntityDeleteSystem } from './network/entity_delete_system';
import { IInputReader } from './input/input_reader';
import { InputReadSystem } from './input/input_read_system';
import { ISocketEmit } from './network/geckos_socket_handler';
import { PhysicsSystem } from '../shared/game/system/physics_system';
import * as Constants from '../shared/constants';

export class ClientWorldManager {
  private worldManager: WorldManager = null;
  private entityFactory: EntityFactory = null;

  constructor(
    spriteCache: SpriteCache,
    gameState: GameState,
    inputReader: IInputReader,
    socketEmit: ISocketEmit
  ) {
    this.worldManager = new WorldManager();
    this.entityFactory = new EntityFactory(this.worldManager.getWorld());
    this.initClientExtras(spriteCache, gameState, inputReader, socketEmit);
  }

  public initClientExtras(
    spriteCache: SpriteCache,
    gameState: GameState,
    inputReader: IInputReader,
    socketEmit: ISocketEmit
  ) {
    this.worldManager
      .getWorld()
      .registerSystem(InputReadSystem, { inputReader, socketEmit })
      .registerSystem(RenderSystem, { spriteCache, gameState })
      .registerSystem(EntityInitSystem, {
        gameState,
        entityFactory: this.entityFactory,
        spriteCache,
      })
      .registerSystem(EntityDeleteSystem, {
        gameState,
        spriteCache,
      })
      .registerSystem(ClientCorrectionSystem, { gameState })
      .registerSystem(InterpolateSystem, { gameState })
      .registerSystem(PhysicsSystem, { worldBounds: Constants.WORLD_BOUNDS });
  }

  public start() {
    this.worldManager.client_start();
  }

  public stop() {
    this.worldManager.getWorld().stop();
  }
}
