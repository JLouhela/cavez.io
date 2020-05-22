import { ISocketEmit } from './socket_emit_interface';
import { GeckosServer } from '@geckos.io/server';
import { IPlayer } from '../player/player_interface';
import * as Protocol from '../../shared/protocol';

export class GeckosSocketEmit implements ISocketEmit {
  private io: GeckosServer;

  constructor(io: GeckosServer) {
    this.io = io;
  }

  public emitSyncPackets(
    listeners: IPlayer[],
    packets: Protocol.IEntityUpdate
  ) {
    for (const listener of listeners) {
      console.log('Sending to ' + listener.socket.id);
      listener.socket.emit(Protocol.SOCKET_EVENT.ENTITY_UPDATE, packets);
    }
  }
}
