import { GameRoom } from './game_room';
import { IPlayer } from '../player/player_interface';

export interface IRoomManager {
  addToRoom(player: IPlayer, roomIndex: number): boolean;
  removeFromRoom(socket: any): void;
}

export class RoomManager implements IRoomManager {
  private maxRoomCount: number = 1;
  private playersPerRoom: number = 10;
  private rooms: { [index: number]: GameRoom } = {};

  constructor(maxRoomCount: number, playersPerRoom: number) {
    this.maxRoomCount = maxRoomCount;
    this.playersPerRoom = playersPerRoom;
    this.rooms[0] = new GameRoom(0, 'Test room');
  }

  public addToRoom(player: IPlayer, roomIndex: number) {
    if (!this.rooms[roomIndex]) {
      console.log('Room ' + roomIndex + ' does not exist');
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
    this.rooms[socket.roomId].removePlayer(socket.id);
  }

  public getPlayer(socketId: string, roomIndex: number) {
    return this.rooms[roomIndex].getPlayer(socketId);
  }
}
