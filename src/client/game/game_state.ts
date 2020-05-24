import * as Protocol from '../../shared/protocol';

// TODO: update sync packets to game state
// fetch from game state to sync system

export class GameState {
  private syncEvents: Protocol.IEntityUpdateEvent[] = [];

  public addSyncEvent(event: Protocol.IEntityUpdateEvent) {
    this.syncEvents.push(event);
  }
}
