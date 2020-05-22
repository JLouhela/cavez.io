import { ISocketEmit } from './socket_emit_interface';
import { GeckosServer } from '@geckos.io/server';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';

export class GeckosSocketEmit implements ISocketEmit {
  private io: GeckosServer;

  constructor(io: GeckosServer) {
    this.io = io;
  }

  // TODO add list of channels to receive the data
  public emitSyncPackets(packets: { [entityId: number]: CNetworkSync }) {
    console.log('Time to emit.. packet size ' + Object.keys(packets).length);
  }
}
