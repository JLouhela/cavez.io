import { ServerWorldManager } from './server_world_manager';
import { RoomManager } from '../room/room_manager';

export class Game {
  private worldManager: ServerWorldManager = null;
  private roomManager: RoomManager = null;
  constructor(roomManager: RoomManager, worldManager: ServerWorldManager) {
    this.roomManager = roomManager;
    this.worldManager = worldManager;
  }

  public spawnPlayer(socketId: string, roomIndex: number) {
    const player = this.roomManager.getPlayer(socketId, roomIndex);
    // TODO level manager..
    this.worldManager.spawnPlayer(player, { x: 50, y: 50 });
  }
}
