import { RoomManager } from '../room/room_manager';

export class Game {
  private roomManager: RoomManager = null;
  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager;
  }

  public spawnPlayer(socketId: string, roomIndex: number) {
    const room = this.roomManager.getRoom(roomIndex);
    // TODO level manager..
    room.spawnPlayer(socketId, { x: 50, y: 50 });
  }
}
