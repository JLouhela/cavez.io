import * as Protocol from '../../shared/protocol';

export class GameState {
  private syncEvents: Protocol.IEntityUpdateEvent[] = [];
  private serverProcessedInput: Protocol.IInputProcessedEvent = null;
  private playerEntityId: number = -1;
  private playerName: string = '';
  private serverTimeOffset: number = 0;

  public addSyncEvent(event: Protocol.IEntityUpdateEvent) {
    this.syncEvents.push(event);
  }

  public getLatestSyncEvent() {
    if (this.syncEvents.length === 0) {
      return null;
    }
    return this.syncEvents[this.syncEvents.length - 1];
  }

  public getSyncEvent(serverTime: number) {
    for (let i = 1; i < this.syncEvents.length; ++i) {
      if (this.syncEvents[i].timestamp > serverTime) {
        if (this.syncEvents[i - 1].timestamp <= serverTime) {
          return this.syncEvents[i - 1];
        }
        break;
      }
    }
    return null;
  }

  // TODO: save longer history for client?
  // Spares some bits
  public removeSyncEvents(serverTime: number) {
    let removeCount = 0;
    for (let i = 0; i < this.syncEvents.length; ++i, ++removeCount) {
      if (this.syncEvents[i].timestamp > serverTime) {
        break;
      }
    }
    // TODO reuse to avoid garbage collection, no splice
    // Keep always at least one element
    this.syncEvents.splice(
      0,
      Math.min(this.syncEvents.length - 1, removeCount)
    );
  }

  public setLastProcessedInput(input: Protocol.IInputProcessedEvent) {
    this.serverProcessedInput = input;
  }

  public getLastProcessedInput(): Protocol.IInputProcessedEvent {
    return this.serverProcessedInput;
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

  public setServerTimeOffset(offset: number) {
    this.serverTimeOffset = offset;
  }

  public getServerTime(localTime: number): number {
    return localTime + this.serverTimeOffset;
  }

  public getLocalTime(serverTime: number): number {
    return serverTime - this.serverTimeOffset;
  }
}
