import { ISocketEmit } from './socket_emit_interface.js';
import { GeckosServer, ServerChannel } from '@geckos.io/server';
import { IServerPlayer } from '../player/player_interface.js';
import * as Protocol from '../../shared/protocol.js';

export class GeckosSocketEmit implements ISocketEmit {
  private io: GeckosServer;

  constructor(io: GeckosServer) {
    this.io = io;
  }

  public emitSyncPackets(
    listeners: IServerPlayer[],
    packets: Protocol.IEntityUpdate,
    timestamp: number
  ) {
    for (const listener of listeners) {
      const event = { timestamp, entityUpdates: packets };
      listener.socket.emit(Protocol.SOCKET_EVENT.ENTITY_UPDATE, event);
    }
  }

  public emitInputProcessed(
    socket: ServerChannel,
    event: Protocol.IInputProcessedEvent
  ): void {
    socket.emit(Protocol.SOCKET_EVENT.INPUT_PROCESSED, event);
  }
}
