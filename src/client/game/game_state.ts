import * as Protocol from '../../shared/protocol';

// TODO: update sync packets to game state
// fetch from game state to sync system

export class GameState {
  private syncEvents: Protocol.IEntityUpdateEvent[] = [];

  public addSyncEvent(event: Protocol.IEntityUpdateEvent) {
    this.syncEvents.push(event);
  }

  public getLatest() {
    if (this.syncEvents.length === 0) {
      return null;
    }
    return this.syncEvents[this.syncEvents.length - 1];
  }

  // Call from a system
  public clean() {
    if (this.syncEvents.length > 2) {
      this.syncEvents.shift();
    }
  }
}
