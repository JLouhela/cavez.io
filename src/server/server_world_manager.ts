import { WorldManager } from '../shared/game/world_manager';

export class ServerWorldManager {
  private worldManager: WorldManager = null;
  constructor() {
    this.worldManager = new WorldManager();
    this.worldManager.server_start();
  }
  public spawnPlayer() {
    console.log('empty implementation spawnPlayer');
  }
}
