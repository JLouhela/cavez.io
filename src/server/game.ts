import { ServerWorldManager } from './server_world_manager';
import { RoomManager } from './room/room_manager';

export class Game {
  private worldManager: ServerWorldManager = null;
  private roomManager: RoomManager = null;
  constructor(roommanager: RoomManager) {
    this.roomManager = roommanager;
    this.worldManager = new ServerWorldManager();
  }

  public spawnPlayer(socketId: string, roomIndex: number) {
    const player = this.roomManager.getPlayer(socketId, roomIndex);
    // TODO level manager..
    this.worldManager.spawnPlayer(player, { x: 50, y: 50 });
  }
}
