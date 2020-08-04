import { System, Entity } from 'ecsy';
import { GameState } from '../game_state';
import { CPosition } from '../../../shared/game/component/cposition';
import { CPlayer } from '../../../shared/game/component/cplayer';
import { ISocketEmit } from '../../socket/socket_emit_interface';
import { IGameRoom } from '../../room/game_room';
import * as Constants from '../../../shared/constants';
import { CPhysics } from '../../../shared/game/component/cphysics';
import { CSync } from '../../../shared/game/component/ctags';
import { IEntitySyncPacket } from '../../../shared/protocol';

export class ServerSyncSystem extends System {
  private gameState: GameState;
  private syncComponents: { [entityId: number]: IEntitySyncPacket } = {};
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
    if (this.cumulativeTime < Constants.SERVER_TICK_RATE) {
      return;
    }
    this.cumulativeTime %= Constants.SERVER_TICK_RATE;

    const processedEntities: Set<string> = new Set();
    this.queries.all.results.forEach((entity) => {
      this.gameState.updateEntity(entity);
      processedEntities.add(entity.id.toString());
      const entityDelta = this.gameState.getDelta(entity.id);

      if (!this.syncComponents[entity.id]) {
        this.syncComponents[entity.id] = {
          pos: null,
          player: null,
          physics: null,
          entityId: entity.id,
        };
      }
      this.updateSyncComponent(this.syncComponents[entity.id], entityDelta);
    });

    // Cross compare processed list with existing list
    // => Collect entities not alive any longer
    // TODO: If this is performance issue, can also delete player entities by name
    const componentsToDelete: string[] = [];
    Object.keys(this.syncComponents).forEach((key) => {
      if (!processedEntities.has(key)) {
        componentsToDelete.push(key);
      }
    });

    // Finally delete removed entities
    componentsToDelete.forEach((id) => {
      console.log('Deleted sync component for entity ' + id);
      delete this.syncComponents[+id];
    });

    this.socketEmit.emitSyncPackets(
      this.gameRoom.getPlayers(),
      this.syncComponents,
      time
    );
  }

  private updateSyncComponent(sync: IEntitySyncPacket, entity: Entity) {
    if (entity.hasComponent(CPosition)) {
      sync.pos = entity.getComponent(CPosition).clone();
    }
    if (entity.hasComponent(CPlayer)) {
      sync.player = entity.getComponent(CPlayer).clone();
    }
    if (entity.hasComponent(CPhysics)) {
      sync.physics = entity.getComponent(CPhysics).clone();
    }
    // TODO unnecessary, id is the key
    sync.entityId = entity.id;
  }
}

ServerSyncSystem.queries = {
  all: {
    components: [CSync],
  },
};
