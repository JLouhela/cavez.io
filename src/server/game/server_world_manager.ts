import { WorldManager } from '../../shared/game/world_manager';
import { IPlayer } from '../player/player_interface';
import { Vec2 } from '../../shared/math/vector';
import { EntityFactory } from '../../shared/game/entity/entity_factory';
import { ISocketEmit } from '../socket/socket_emit_interface';
import { SyncSystem } from './sync_system';

export class ServerWorldManager {
  private worldManager: WorldManager = null;
  private entityFactory: EntityFactory = null;

  constructor(socketEmit: ISocketEmit) {
    this.worldManager = new WorldManager();
    this.entityFactory = new EntityFactory(this.worldManager.getWorld());
    this.initServerExtras(socketEmit);
    this.worldManager.server_start();
  }

  public initServerExtras(socketEmit: ISocketEmit) {
    this.worldManager.getWorld().registerSystem(SyncSystem, { socketEmit });
  }

  public spawnPlayer(player: IPlayer, pos: Vec2) {
    console.log(
      'spawning player ' + player.name + ' to ' + pos.x + ', ' + pos.y
    );
    this.entityFactory.createPlayerEntity(player.socket.id, player.color);
  }
}
