import { IServerPlayer } from '../player/player_interface.js';
import { IEntitySyncPacket, IInputProcessedEvent } from '../../shared/protocol.js';

export interface ISocketEmit {
  emitSyncPackets(
    listeners: IServerPlayer[],
    packets: { [entityId: number]: IEntitySyncPacket },
    timestamp: number
  ): void;

  emitInputProcessed(socket: any, event: IInputProcessedEvent): void;
}
