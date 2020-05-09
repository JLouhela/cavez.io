import { IPlayer } from './player_interface';

export interface IRoomHandler {
  addToRoom(player: IPlayer, roomIndex: number): void;
}
