import { ServerWorldManager } from './server_world_manager';

export class Game {
  private worldManager: ServerWorldManager = null;
  constructor() {
    this.worldManager = new ServerWorldManager();
  }
  public spawnPlayer() {
    console.log('empty implementation spawnPlayer');
  }
}
