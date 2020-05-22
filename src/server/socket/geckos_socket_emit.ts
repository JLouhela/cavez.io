import { ISocketEmit } from './socket_emit_interface';
import { GeckosServer } from '@geckos.io/server';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { IPlayer } from '../player/player_interface';

export class GeckosSocketEmit implements ISocketEmit {
  private io: GeckosServer;

  constructor(io: GeckosServer) {
    this.io = io;
  }

  public emitSyncPackets(
    listeners: IPlayer[],
    packets: { [entityId: number]: CNetworkSync }
  ) {
    for (const listener of listeners) {
      for (const entityId in packets) {
        // TODO: performance of this unnecessary check? We know data layout
        if (packets.hasOwnProperty(entityId)) {
          this.io.emit(listener.socket, packets[entityId]);
        }
      }
    }
  }
}
