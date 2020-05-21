import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';

export interface ISocketEmit {
  emitSyncPackets(packets: { [entityId: number]: CNetworkSync }): void;
}
