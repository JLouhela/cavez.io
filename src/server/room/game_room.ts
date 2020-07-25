import { IPlayer } from '../player/player_interface';
import { ServerWorldManager } from '../game/server_world_manager';
import { ISocketEmit } from '../socket/socket_emit_interface';
import { ServerLevelManager } from '../game/server_level_manager';
import * as Protocol from '../../shared/protocol';
import { InputManager } from '../game/input_manager';

export interface IGameRoom {
  getPlayers(): IPlayer[];
  isReady(): boolean;
}

export class GameRoom implements IGameRoom {
  private index: number = -1;
  private title: string = 'undefined;';
  private players: IPlayer[] = [];
  private socketEmit: ISocketEmit = null;
  private worldManager: ServerWorldManager = null;
  private levelManager: ServerLevelManager = null;
  private inputManager: InputManager = null;
  private initialized: boolean = false;

  constructor(index: number, title: string, socketEmit: ISocketEmit) {
    this.index = index;
    this.title = title;
    this.levelManager = new ServerLevelManager();

    this.levelManager.loadLevel().then(() => {
      // TODO check if load was ok?
      this.inputManager = new InputManager();
      this.worldManager = new ServerWorldManager(
        socketEmit,
        this,
        this.inputManager
      );
      this.initialized = true;
      console.log(
        'Game room ' + index + ' with title ' + title + ' started successfully'
      );
      console.log('Current level: ' + this.levelManager.levelName);
    });
  }

  public getPlayers() {
    return this.players;
  }

  public isReady(): boolean {
    return this.initialized;
  }

  public addPlayer(player: IPlayer) {
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

  removePlayer(socketId: string) {
    const found = this.players.find((p) => p.socket.id === socketId);
    if (found) {
      console.log('Erased player ' + found.name + ' from room ' + this.index);
      this.worldManager.removePlayer(found.name);
      found.socket.leave();
      this.players.splice(this.players.indexOf(found), 1);
    }
  }

  getPlayer(socketId: string) {
    return this.players.find((p) => p.socket.id === socketId);
  }

  playerCount(): number {
    return this.players.length;
  }

  spawnPlayer(socketId: string) {
    const player = this.getPlayer(socketId);
    if (!player) {
      console.log(
        'Could not spawn player with socket id ' +
          socketId +
          ' to room ' +
          this.index
      );
      return;
    }
    this.worldManager.spawnPlayer(player, this.levelManager.getSpawnPoint());
  }

  addInputUpdate(socketId: string, event: Protocol.IInputUpdateEvent) {
    this.inputManager.addInputUpdate(socketId, event);
  }

  getLevel(): string {
    return this.levelManager.levelName;
  }
}
