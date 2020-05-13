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

  removePlayer(socketId: any) {
    const found = this.players.find((p) => p.socket.id === socketId);
    if (found) {
      console.log('Erased player ' + found.name + ' from room ' + this.index);
      found.socket.leave();
      this.players.splice(this.players.indexOf(found), 1);
    }
  }

  playerCount(): number {
    return this.players.length;
  }
}
