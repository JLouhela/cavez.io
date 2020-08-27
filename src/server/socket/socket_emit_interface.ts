import { IPlayer } from '../player/player_interface';
import { IEntitySyncPacket, IInputProcessedEvent } from '../../shared/protocol';

export interface ISocketEmit {
  emitSyncPackets(
    listeners: IPlayer[],
    packets: { [entityId: number]: IEntitySyncPacket },
    timestamp: number
  ): void;

  emitInputProcessed(socket: any, event: IInputProcessedEvent): void;
}
