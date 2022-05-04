import { IServerPlayer } from '../player/player_interface.js';
import { IVec2 } from '../../shared/math/vector.js';
import { EntityFactory } from '../../shared/game/entity/entity_factory.js';
import { ISocketEmit } from '../socket/socket_emit_interface.js';
import { ServerSyncSystem } from './system/server_sync_system.js';
import { IGameRoom } from '../room/game_room.js';
import { PhysicsSystem } from '../../shared/game/system/physics_system.js';
import * as Constants from '../../shared/constants.js';
import { EntityDeleteSystem } from './system/entity_delete_system.js';
import { CSocket } from '../socket/csocket.js';
import { InputManager } from './input_manager.js';
import { InputHandleSystem } from './system/input_handle_system.js';
import { performance } from 'perf_hooks';
import { World } from 'ecsy';
import { CPhysics } from '../../shared/game/component/cphysics.js';
import { CThrottle } from '../../shared/game/component/cthrottle.js';
import { CSync } from '../../shared/game/component/ctags.js';
import { CPlayer } from '../../shared/game/component/cplayer.js';
import { CPosition } from '../../shared/game/component/cposition.js';
import { CollisionDetectionSystem } from '../../shared/game/system/collision_detection_system.js';
import { CTerrainCollider } from '../../shared/game/component/cterrain_collider.js';
import { CTerrainCollision } from '../../shared/game/component/cterrain_collision.js';
import { ILevelProvider } from '../../shared/game/level/level_provider_interface.js';
import { CollisionResolveSystem } from '../../shared/game/system/collision_resolve_system.js';

export class ServerWorldManager {
  private entityFactory: EntityFactory = null;
  private eraseByPlayerName: string[] = [];
  private world: World = null;

  constructor(
    socketEmit: ISocketEmit,
    gameRoom: IGameRoom,
    inputManager: InputManager,
    levelProvider: ILevelProvider
  ) {
    this.world = new World({ entityPoolSize: 500 });
    this.entityFactory = new EntityFactory(this.world);
    this.registerComponents();
    this.initSystems(socketEmit, gameRoom, inputManager, levelProvider);
    this.start();
  }

  private registerComponents() {
    this.world.registerComponent(CSocket);
    this.world.registerComponent(CThrottle);
    this.world.registerComponent(CPhysics);
    this.world.registerComponent(CPlayer);
    this.world.registerComponent(CSync);
    this.world.registerComponent(CPosition);
    this.world.registerComponent(CTerrainCollider);
    this.world.registerComponent(CTerrainCollision);
  }

  private initSystems(
    socketEmit: ISocketEmit,
    gameRoom: IGameRoom,
    inputManager: InputManager,
    levelProvider: ILevelProvider
  ) {
    this.world
      .registerSystem(EntityDeleteSystem, {
        eraseByPlayerName: this.eraseByPlayerName,
      })
      .registerSystem(InputHandleSystem, { socketEmit, gameRoom, inputManager })
      .registerSystem(ServerSyncSystem, { socketEmit, gameRoom })
      .registerSystem(PhysicsSystem)
      .registerSystem(CollisionDetectionSystem, {
        levelProvider,
      })
      .registerSystem(CollisionResolveSystem);
  }

  public spawnPlayer(player: IServerPlayer, pos: IVec2) {
    console.log(`spawning player ${player.name} to ${pos.x}, ${pos.y}`);
    const e = this.entityFactory.createPlayerEntity(
      player.name,
      player.color,
      pos
    );
    e.addComponent(CSocket, { socketId: player.socket.id });
  }

  public removePlayer(playerName: string) {
    this.eraseByPlayerName.push(playerName);
  }

  private start(): void {
    function server_step() {
      const time = performance.now();
      const delta = (time - lastWorldUpdate) / 1000.0;
      if (delta > Constants.SERVER_WORLD_STEP_RATE) {
        world.execute(delta, time);
        lastWorldUpdate = time;
      }
      // Schedule timeout to get closer (save cpu), until fixed threshold (20% for now)
      if (time - lastWorldUpdate < 0.8 * Constants.SERVER_WORLD_STEP_RATE) {
        setTimeout(server_step);
      } else {
        setImmediate(server_step);
      }
    }
    let lastWorldUpdate = performance.now();
    const world = this.world;
    server_step();
  }
}
