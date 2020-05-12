import { GameRoom } from './game_room';
import { IPlayer } from '../player/player_interface';

export interface IRoomManager {
  addToRoom(player: IPlayer, roomIndex: number): boolean;
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

  public removePlayer(player: IPlayer) {
    this.rooms[player.socket.roomId].removePlayer(player);
  }
}
