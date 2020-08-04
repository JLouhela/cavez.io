import { IPlayer } from '../player/player_interface';
import { IVec2 } from '../../shared/math/vector';
import { EntityFactory } from '../../shared/game/entity/entity_factory';
import { ISocketEmit } from '../socket/socket_emit_interface';
import { ServerSyncSystem } from './system/server_sync_system';
import { IGameRoom } from '../room/game_room';
import { PhysicsSystem } from '../../shared/game/system/physics_system';
import * as Constants from '../../shared/constants';
import { EntityDeleteSystem } from './system/entity_delete_system';
import { CSocket } from '../socket/csocket';
import { InputManager } from './input_manager';
import { InputHandleSystem } from './system/input_handle_system';
import { performance } from 'perf_hooks';
import { World } from 'ecsy';
import { CPhysics } from '../../shared/game/component/cphysics';
import { CThrottle } from '../../shared/game/component/cthrottle';
import { CSync } from '../../shared/game/component/ctags';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CPosition } from '../../shared/game/component/cposition';

export class ServerWorldManager {
  private entityFactory: EntityFactory = null;
  private eraseByPlayerName: string[] = [];
  private world: World = null;

  constructor(
    socketEmit: ISocketEmit,
    gameRoom: IGameRoom,
    inputManager: InputManager
  ) {
    this.world = new World();
    this.entityFactory = new EntityFactory(this.world);
    this.registerComponents();
    this.initSystems(socketEmit, gameRoom, inputManager);
    this.start();
  }

  private registerComponents() {
    this.world.registerComponent(CSocket);
    this.world.registerComponent(CThrottle);
    this.world.registerComponent(CPhysics);
    this.world.registerComponent(CPlayer);
    this.world.registerComponent(CSync);
    this.world.registerComponent(CPosition);
  }

  private initSystems(
    socketEmit: ISocketEmit,
    gameRoom: IGameRoom,
    inputManager: InputManager
  ) {
    this.world
      .registerSystem(EntityDeleteSystem, {
        eraseByPlayerName: this.eraseByPlayerName,
      })
      .registerSystem(InputHandleSystem, { inputManager })
      .registerSystem(ServerSyncSystem, { socketEmit, gameRoom })
      .registerSystem(PhysicsSystem, { worldBounds: Constants.WORLD_BOUNDS });
  }

  public spawnPlayer(player: IPlayer, pos: IVec2) {
    console.log(
      'spawning player ' + player.name + ' to ' + pos.x + ', ' + pos.y
    );
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
