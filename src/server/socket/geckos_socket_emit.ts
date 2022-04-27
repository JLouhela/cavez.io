import { ISocketEmit } from './socket_emit_interface.js';
import { GeckosServer } from '@geckos.io/server';
import { IPlayer } from '../player/player_interface.js';
import * as Protocol from '../../shared/protocol.js';

export class GeckosSocketEmit implements ISocketEmit {
  private io: GeckosServer;

  constructor(io: GeckosServer) {
    this.io = io;
  }

  public emitSyncPackets(
    listeners: IPlayer[],
    packets: Protocol.IEntityUpdate,
    timestamp: number
  ) {
    for (const listener of listeners) {
      const event = { timestamp, entityUpdates: packets };
      listener.socket.emit(Protocol.SOCKET_EVENT.ENTITY_UPDATE, event);
    }
  }

  public emitInputProcessed(
    socket: any,
    event: Protocol.IInputProcessedEvent
  ): void {
    socket.emit(Protocol.SOCKET_EVENT.INPUT_PROCESSED, event);
  }
}
