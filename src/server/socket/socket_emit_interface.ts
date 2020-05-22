import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { IPlayer } from '../player/player_interface';

export interface ISocketEmit {
  emitSyncPackets(
    listeners: IPlayer[],
    packets: { [entityId: number]: CNetworkSync }
  ): void;
}
