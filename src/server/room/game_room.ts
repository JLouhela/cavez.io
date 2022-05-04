import { IServerPlayer } from '../player/player_interface.js';
import { ServerWorldManager } from '../game/server_world_manager.js';
import { ISocketEmit } from '../socket/socket_emit_interface.js';
import { ServerLevelManager } from '../game/server_level_manager.js';
import * as Protocol from '../../shared/protocol.js';
import { InputManager } from '../game/input_manager.js';

export interface IGameRoom {
  getPlayers(): IServerPlayer[];
  getPlayer(socketId: string): IServerPlayer;
  isReady(): boolean;
}

export class GameRoom implements IGameRoom {
  private id = "";
  private title = 'undefined;.js';
  private players: IServerPlayer[] = [];
  private socketEmit: ISocketEmit = null;
  private worldManager: ServerWorldManager = null;
  private levelManager: ServerLevelManager = null;
  private inputManager: InputManager = null;
  private initialized = false;

  constructor(id: string, title: string, socketEmit: ISocketEmit) {
    this.id = id;
    this.title = title;
    this.levelManager = new ServerLevelManager();

    this.levelManager.loadLevel().then(() => {
      // TODO check if load was ok?
      this.inputManager = new InputManager();
      this.worldManager = new ServerWorldManager(
        socketEmit,
        this,
        this.inputManager,
        this.levelManager
      );
      this.initialized = true;
      console.log(`Game room ${this.id} with title ${title} started successfully`);
      console.log(`Current level: ${this.levelManager.levelName}`);
    });
  }

  public getPlayers() {
    return this.players;
  }

  public isReady(): boolean {
    return this.initialized;
  }

  public addPlayer(player: IServerPlayer) {
    if (this.players.find((p) => p.socket.id === player.socket.id)) {
      console.log('Player ' + player.name + ' already in room ' + this.id);
      return;
    }
    console.log(`Player${player.name} of color ${player.color} joined room ${this.id}`);

    player.socket.join(this.id);
    this.players.push(player);
  }

  removePlayer(socketId: string) {
    const found = this.players.find((p) => p.socket.id === socketId);
    if (found) {
      console.log('Erased player ' + found.name + ' from room ' + this.id);
      found.socket.leave();
      found.socket.close();
      this.worldManager.removePlayer(found.name);
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
      console.log(`Could not spawn player with socket id ${socketId} to room ${this.id}`);
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
