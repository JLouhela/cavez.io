import { System, Entity } from 'ecsy';
import { GameState } from './game_state';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { ISocketEmit } from '../socket/socket_emit_interface';
import { IGameRoom } from '../room/game_room';
import * as Constants from '../../shared/constants';

export class ServerSyncSystem extends System {
  private gameState: GameState;
  private syncComponents: { [entityId: number]: CNetworkSync } = {};
  private cumulativeTime: number = 0;
  private socketEmit: ISocketEmit;
  private gameRoom: IGameRoom;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.gameState = new GameState();
    this.socketEmit = attributes.socketEmit;
    this.gameRoom = attributes.gameRoom;
  }

  execute(delta: number, time: number) {
    this.cumulativeTime += delta;
    if (this.cumulativeTime > Constants.SERVER_TICK_RATE) {
      this.cumulativeTime %= Constants.SERVER_TICK_RATE;

      this.queries.all.results.forEach((entity) => {
        this.gameState.updateEntity(entity);
        const entityDelta = this.gameState.getDelta(entity.id);

        if (!this.syncComponents[entity.id]) {
          this.syncComponents[entity.id] = new CNetworkSync();
        }
        this.updateSyncComponent(this.syncComponents[entity.id], entityDelta);
      });
      this.socketEmit.emitSyncPackets(
        this.gameRoom.getPlayers(),
        this.syncComponents
      );
    }
  }

  private updateSyncComponent(csync: CNetworkSync, entity: Entity) {
    csync.pos = entity.getComponent(CPosition);
    csync.entityId = entity.id;
  }
}

ServerSyncSystem.queries = {
  all: {
    components: [CPosition],
  },
};
