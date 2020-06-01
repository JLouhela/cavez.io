import { WorldManager } from '../../shared/game/world_manager';
import { IPlayer } from '../player/player_interface';
import { IVec2 } from '../../shared/math/vector';
import { EntityFactory } from '../../shared/game/entity/entity_factory';
import { ISocketEmit } from '../socket/socket_emit_interface';
import { ServerSyncSystem } from './server_sync_system';
import { IGameRoom } from '../room/game_room';
import { PhysicsSystem } from '../../shared/game/system/physics_system';
import * as Constants from '../../shared/constants';
import { EntityDeleteSystem } from './entity_delete_system';

export class ServerWorldManager {
  private worldManager: WorldManager = null;
  private entityFactory: EntityFactory = null;
  private eraseByPlayerName: string[] = [];

  constructor(socketEmit: ISocketEmit, gameRoom: IGameRoom) {
    this.worldManager = new WorldManager();
    this.entityFactory = new EntityFactory(this.worldManager.getWorld());
    this.initServerExtras(socketEmit, gameRoom);
    this.worldManager.server_start();
  }

  public initServerExtras(socketEmit: ISocketEmit, gameRoom: IGameRoom) {
    this.worldManager
      .getWorld()
      .registerSystem(ServerSyncSystem, { socketEmit, gameRoom })
      .registerSystem(PhysicsSystem, { worldBounds: Constants.WORLD_BOUNDS })
      .registerSystem(EntityDeleteSystem, {
        eraseByPlayerName: this.eraseByPlayerName,
      });
  }

  public spawnPlayer(player: IPlayer, pos: IVec2) {
    console.log(
      'spawning player ' + player.name + ' to ' + pos.x + ', ' + pos.y
    );
    this.entityFactory.createPlayerEntity(player.name, player.color, pos);
  }

  public removePlayer(playerName: string) {
    this.eraseByPlayerName.push(playerName);
  }
}
