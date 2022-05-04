import { GameRoom } from './game_room.js';
import { IPlayer } from '../player/player_interface.js';
import { ISocketEmit } from '../socket/socket_emit_interface.js';

export interface IRoomManager {
  addToRoom(player: IPlayer, roomId: string): boolean;
  removeFromRoom(socket: any): void;
  getRoom(roomId: string): GameRoom;
  getPlayer(socketId: string, roomId: string): IPlayer;
  getLevel(roomId: string): string;
}

export class RoomManager implements IRoomManager {
  private maxRoomCount = 1;
  private playersPerRoom = 10;
  private rooms: { [id: string]: GameRoom } = {};

  constructor(
    maxRoomCount: number,
    playersPerRoom: number,
    socketEmit: ISocketEmit
  ) {
    this.maxRoomCount = maxRoomCount;
    this.playersPerRoom = playersPerRoom;
    this.rooms[0] = new GameRoom(0, 'Test room', socketEmit);
  }

  public addToRoom(player: IPlayer, roomId: string) {
    if (!this.rooms[roomId]) {
      console.log(`Room ${roomId} does not exist`);
      return false;
    }
    if (!this.rooms[roomId].isReady()) {
      console.log(`Room ${roomId} not ready yet`);
      return false;
    }
    if (this.rooms[roomId].playerCount() >= this.playersPerRoom) {
      console.log(`Room ${roomId}  is full`);
      return false;
    }
    this.rooms[roomId].addPlayer(player);
    return true;
  }

  public removeFromRoom(socket: any) {
    if (socket.roomId in this.rooms) {
      this.rooms[socket.roomId].removePlayer(socket.id);
    }
  }

  public getPlayer(socketId: string, roomId: string) {
    return this.rooms[roomId].getPlayer(socketId);
  }

  public getRoom(roomId: string): GameRoom {
    return this.rooms[roomId];
  }

  public getLevel(roomId: string): string {
    return this.rooms[roomId].getLevel();
  }
}
