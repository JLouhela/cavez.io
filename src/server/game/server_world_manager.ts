import { WorldManager } from '../../shared/game/world_manager';
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

export class ServerWorldManager {
  private worldManager: WorldManager = null;
  private entityFactory: EntityFactory = null;
  private eraseByPlayerName: string[] = [];

  constructor(
    socketEmit: ISocketEmit,
    gameRoom: IGameRoom,
    inputManager: InputManager
  ) {
    this.worldManager = new WorldManager();
    this.entityFactory = new EntityFactory(this.worldManager.getWorld());
    this.initServerExtras(socketEmit, gameRoom, inputManager);
    this.worldManager.server_start();
  }

  public initServerExtras(
    socketEmit: ISocketEmit,
    gameRoom: IGameRoom,
    inputManager: InputManager
  ) {
    this.worldManager
      .getWorld()
      .registerSystem(InputHandleSystem, { inputManager })
      .registerSystem(ServerSyncSystem, { socketEmit, gameRoom })
      .registerSystem(EntityDeleteSystem, {
        eraseByPlayerName: this.eraseByPlayerName,
      })
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
}
