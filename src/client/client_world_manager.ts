import { RenderSystem } from './rendering/render_system.js';
import { DebugRenderSystem } from './rendering/debug_render_system.js';
import { SpriteCache } from './assets/sprite_cache.js';
import { EntityInitSystem } from './network/entity_init_system.js';
import { GameState } from './game/game_state.js';
import { EntityFactory } from '../shared/game/entity/entity_factory.js';
import { InterpolateSystem } from './network/interpolate_system.js';
import { ClientCorrectionSystem } from './network/client_correction_system.js';
import { EntityDeleteSystem } from './network/entity_delete_system.js';
import { IInputReader } from './input/input_reader.js';
import { InputReadSystem } from './input/input_read_system.js';
import { ISocketEmit } from './network/geckos_socket_handler.js';
import { PhysicsSystem } from '../shared/game/system/physics_system.js';
import * as Constants from '../shared/constants.js';
import { Camera } from './game/camera/camera.js';
import { CameraSystem } from './game/camera/camera_system.js';
import * as PIXI from 'pixi.js';
import { World } from 'ecsy';
import { CPhysics } from '../shared/game/component/cphysics.js';
import { CThrottle } from '../shared/game/component/cthrottle.js';
import { CSync } from '../shared/game/component/ctags.js';
import { CPlayer } from '../shared/game/component/cplayer.js';
import { CNetworkEntity } from '../shared/game/component/cnetwork_entity.js';
import { CPosition } from '../shared/game/component/cposition.js';
import { CCameraFollow } from './game/camera/ccamera_follow.js';
import { CSprite } from './rendering/csprite.js';
import { CInput } from '../shared/game/component/cinput.js';
import { CTerrainCollider } from '../shared/game/component/cterrain_collider.js';
import { CTerrainCollision } from '../shared/game/component/cterrain_collision.js';
import { CollisionDetectionSystem } from '../shared/game/system/collision_detection_system.js';
import { ClientLevelManager } from './client_level_manager.js';
import { CollisionResolveSystem } from '../shared/game/system/collision_resolve_system.js';
import { InputHistory } from './input/input_history.js';

export class ClientWorldManager {
  private entityFactory: EntityFactory = null;
  private running = false;
  private world: World = null;

  constructor(
    spriteCache: SpriteCache,
    gameState: GameState,
    inputReader: IInputReader,
    socketEmit: ISocketEmit,
    camera: Camera,
    renderer: PIXI.Renderer,
    levelManager: ClientLevelManager,
    inputHistory: InputHistory
  ) {
    this.world = new World({entityPoolSize: 500});
    this.entityFactory = new EntityFactory(this.world);
    this.registerComponents();
    this.initSystems(
      spriteCache,
      gameState,
      inputReader,
      socketEmit,
      camera,
      renderer,
      levelManager,
      inputHistory
    );
  }
  private registerComponents() {
    this.world.registerComponent(CThrottle);
    this.world.registerComponent(CPhysics);
    this.world.registerComponent(CPlayer);
    this.world.registerComponent(CSync);
    this.world.registerComponent(CNetworkEntity);
    this.world.registerComponent(CPosition);
    this.world.registerComponent(CCameraFollow);
    this.world.registerComponent(CSprite);
    this.world.registerComponent(CInput);
    this.world.registerComponent(CTerrainCollider);
    this.world.registerComponent(CTerrainCollision);
  }

  private initSystems(
    spriteCache: SpriteCache,
    gameState: GameState,
    inputReader: IInputReader,
    socketEmit: ISocketEmit,
    camera: Camera,
    renderer: PIXI.Renderer,
    levelManager: ClientLevelManager,
    inputHistory: InputHistory
  ) {
    camera.setLevelSize(Constants.WORLD_BOUNDS);
    this.world
      .registerSystem(InputReadSystem, {
        inputReader,
        socketEmit,
        inputHistory,
      })
      .registerSystem(EntityInitSystem, {
        gameState,
        entityFactory: this.entityFactory,
        spriteCache,
      })
      .registerSystem(EntityDeleteSystem, {
        gameState,
        spriteCache,
      })
      .registerSystem(ClientCorrectionSystem, {
        gameState,
        inputHistory,
        levelProvider: levelManager,
      })
      .registerSystem(InterpolateSystem, { gameState })
      .registerSystem(PhysicsSystem)
      .registerSystem(CollisionDetectionSystem, { levelProvider: levelManager })
      .registerSystem(CollisionResolveSystem)
      .registerSystem(CameraSystem, { camera })
      .registerSystem(RenderSystem, {
        spriteCache,
        camera,
        renderer,
      })
      .registerSystem(DebugRenderSystem, {
        spriteCache,
        gameState,
        camera,
        renderer,
      });
  }

  public stop() {
    this.world.stop();
    this.running = false;
  }

  public start(): void {
    this.running = true;
    function client_step() {
      const time = performance.now();
      const delta = (time - lastTime) / 1000.0;

      // Run all the systems
      world.execute(delta, time);
      lastTime = time;
      requestAnimationFrame(client_step);
    }
    let lastTime = performance.now();
    const world = this.world;
    if (this.running) {
      client_step();
    }
  }
}
