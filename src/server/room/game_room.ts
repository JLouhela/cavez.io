import { IPlayer } from '../player/player_interface';

export class GameRoom {
  private index: number = -1;
  private title: string = 'undefined;';
  private players: IPlayer[] = [];

  constructor(index: number, title: string) {
    this.index = index;
    this.title = title;
  }

  addPlayer(player: IPlayer) {
    if (this.players.find((p) => p.socket.id === player.socket.id)) {
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

    player.socket.join(this.index);
    this.players.push(player);
  }

  removePlayer(player: IPlayer) {
    let p = this.players.find((p) => p.socket.id === player.socket.id);
    if (p) {
      console.log('Erased player ' + p.name + ' from room ' + this.index);
      p.socket.leave();
      this.players.splice(this.players.indexOf(p), 1);
    }
  }

  playerCount(): number {
    return this.players.length;
  }
}
