import { GameRoom } from './game_room.js';
import { IPlayer } from '../player/player_interface.js';
import { ISocketEmit } from '../socket/socket_emit_interface.js';

export interface IRoomManager {
  addToRoom(player: IPlayer, roomIndex: number): boolean;
  removeFromRoom(socket: any): void;
  getRoom(index: number): GameRoom;
  getPlayer(socketId: string, roomIndex: number): IPlayer;
  getLevel(roomIndex: number): string;
}

export class RoomManager implements IRoomManager {
  private maxRoomCount = 1;
  private playersPerRoom = 10;
  private rooms: { [index: number]: GameRoom } = {};

  constructor(
    maxRoomCount: number,
    playersPerRoom: number,
    socketEmit: ISocketEmit
  ) {
    this.maxRoomCount = maxRoomCount;
    this.playersPerRoom = playersPerRoom;
    this.rooms[0] = new GameRoom(0, 'Test room', socketEmit);
  }

  public addToRoom(player: IPlayer, roomIndex: number) {
    if (!this.rooms[roomIndex]) {
      console.log('Room ' + roomIndex + ' does not exist');
      return false;
    }
    if (!this.rooms[roomIndex].isReady()) {
      console.log('Room ' + roomIndex + ' not ready yet');
      return false;
    }
    if (this.rooms[roomIndex].playerCount() >= this.playersPerRoom) {
      console.log('Room ' + roomIndex + ' is full');
      return false;
    }
    this.rooms[roomIndex].addPlayer(player);
    return true;
  }

  public removeFromRoom(socket: any) {
    if (socket.roomId in this.rooms) {
      this.rooms[socket.roomId].removePlayer(socket.id);
    }
  }

  public getPlayer(socketId: string, roomIndex: number) {
    return this.rooms[roomIndex].getPlayer(socketId);
  }

  public getRoom(roomIndex: number): GameRoom {
    return this.rooms[roomIndex];
  }

  public getLevel(roomIndex: number): string {
    return this.rooms[roomIndex].getLevel();
  }
}
