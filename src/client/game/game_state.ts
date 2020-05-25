import * as Protocol from '../../shared/protocol';

export class GameState {
  private syncEvents: Protocol.IEntityUpdateEvent[] = [];
  private playerEntityId: number = -1;
  private playerName: string = '';

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

  public setPlayerId(id: number) {
    this.playerEntityId = id;
  }

  public getPlayerId(): number {
    return this.playerEntityId;
  }

  public setPlayerName(name: string) {
    this.playerName = name;
  }

  public getPlayerName(): string {
    return this.playerName;
  }
}
