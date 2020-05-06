import { IPlayer } from './player';

export class GameRoom {
  private index: number = -1;
  private title: string = 'undefined;';
  private players: IPlayer[] = [];

  constructor(index: number, title: string) {
    this.index = index;
    this.title = title;
  }

  addPlayer(player: IPlayer) {
    console.log('Player ' + player.name + ' joined room ' + this.index);
    this.players.push(player);
  }
}
