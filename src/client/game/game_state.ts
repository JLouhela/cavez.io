import * as Protocol from '../../shared/protocol';
import { SyncHistory, InterpolateState } from './sync_history';

export class GameState {
  private syncHistory: SyncHistory = null;
  private serverProcessedInput: Protocol.IInputProcessedEvent = null;
  private playerEntityId: number = -1;
  private playerName: string = '';
  private serverTimeOffset: number = 0;

  constructor() {
    this.syncHistory = new SyncHistory(30);
  }

  public addSyncEvent(event: Protocol.IEntityUpdateEvent) {
    this.syncHistory.storeSyncEvents(event.timestamp, event.entityUpdates);
  }

  public getLatestSyncEvent() {
    return this.syncHistory.getLatest();
  }

  public getInterpolateState() {
    return this.syncHistory.getInterpolateState();
  }

  public getSyncEvent(serverTime: number) {
    return this.syncHistory.getSyncEvent(serverTime);
  }

  // TODO: save longer history for client?
  // Spares some bits
  public removeSyncEvents(serverTime: number) {
    this.syncHistory.removeUntil(serverTime);
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
