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
import { Camera } from './game/camera/camera';
import { CameraSystem } from './game/camera/camera_system';
import * as PIXI from 'pixi.js';
import { World } from 'ecsy';
import { CPhysics } from '../shared/game/component/cphysics';
import { CThrottle } from '../shared/game/component/cthrottle';
import { CSync } from '../shared/game/component/ctags';
import { CPlayer } from '../shared/game/component/cplayer';
import { CNetworkEntity } from '../shared/game/component/cnetwork_entity';
import { CPosition } from '../shared/game/component/cposition';
import { CCameraFollow } from './game/camera/ccamera_follow';
import { CSprite } from './rendering/csprite';
import { CInput } from '../shared/game/component/cinput';
import { CTerrainCollider } from '../shared/game/component/cterrain_collider';
import { CTerrainCollision } from '../shared/game/component/cterrain_collision';
import { CollisionDetectionSystem } from '../shared/game/system/collision_detection_system';
import { ClientLevelManager } from './client_level_manager';
import { CollisionResolveSystem } from '../shared/game/system/collision_resolve_system';

export class ClientWorldManager {
  private entityFactory: EntityFactory = null;
  private running: boolean = false;
  private world: World = null;

  constructor(
    spriteCache: SpriteCache,
    gameState: GameState,
    inputReader: IInputReader,
    socketEmit: ISocketEmit,
    camera: Camera,
    renderer: PIXI.Renderer,
    levelManager: ClientLevelManager
  ) {
    this.world = new World();
    this.entityFactory = new EntityFactory(this.world);
    this.registerComponents();
    this.initSystems(
      spriteCache,
      gameState,
      inputReader,
      socketEmit,
      camera,
      renderer,
      levelManager
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
    levelManager: ClientLevelManager
  ) {
    camera.setLevelSize(Constants.WORLD_BOUNDS);
    this.world
      .registerSystem(InputReadSystem, { inputReader, socketEmit })
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
      .registerSystem(PhysicsSystem, { worldBounds: Constants.WORLD_BOUNDS })
      .registerSystem(CollisionDetectionSystem, { levelProvider: levelManager })
      .registerSystem(CollisionResolveSystem)
      .registerSystem(CameraSystem, { camera })
      .registerSystem(RenderSystem, {
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
