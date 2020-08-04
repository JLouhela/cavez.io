import { IPlayer } from '../player/player_interface';
import { IEntitySyncPacket } from '../../shared/protocol';

export interface ISocketEmit {
  emitSyncPackets(
    listeners: IPlayer[],
    packets: { [entityId: number]: IEntitySyncPacket },
    timestamp: number
  ): void;
}
