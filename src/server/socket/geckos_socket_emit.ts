import { ISocketEmit } from './socket_emit_interface';
import { GeckosServer } from '@geckos.io/server';
import { IRoomManager } from '../room/room_manager';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';

export class GeckosSocketEmit implements ISocketEmit {
  private io: GeckosServer;
  private roomManager: IRoomManager;

  constructor(roomManager: IRoomManager, io: GeckosServer) {
    this.roomManager = roomManager;
    this.io = io;
  }
  public emitSyncPackets(packets: { [entityId: number]: CNetworkSync }) {
    console.log('Time to emit.. packet size ' + Object.keys(packets).length);
  }
}
