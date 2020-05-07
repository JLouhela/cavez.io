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
    if (this.players.find((p) => p.socket === player.socket)) {
      console.log('Player ' + player.name + ' already in room ' + this.index);
      return;
    }
    console.log(
      'Player ' +
        player.name +
        ' of color ' +
        player.color +
        ' joined room ' +
        this.index
    );

    this.players.push(player);
  }
}
