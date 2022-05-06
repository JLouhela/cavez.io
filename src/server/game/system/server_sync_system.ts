import { System, Entity, Attributes, World } from 'ecsy';
import { GameState } from '../game_state.js';
import { CPosition } from '../../../shared/game/component/cposition.js';
import { CPlayer } from '../../../shared/game/component/cplayer.js';
import { ISocketEmit } from '../../socket/socket_emit_interface.js';
import { IGameRoom } from '../../room/game_room.js';
import * as Constants from '../../../shared/constants.js';
import { CPhysics } from '../../../shared/game/component/cphysics.js';
import { CSync } from '../../../shared/game/component/ctags.js';
import { IEntitySyncPacket } from '../../../shared/protocol.js';
import * as CopyUtils from '../../../shared/game/component/copy_utils.js'
import { performance } from 'perf_hooks';
import { Vec2 } from '../../../shared/math/vector.js';

export class ServerSyncSystem extends System {
  private gameState: GameState;
  private syncComponents: { [entityId: number]: IEntitySyncPacket } = {};
  private cumulativeTime = 0;
  private socketEmit: ISocketEmit;
  private gameRoom: IGameRoom;

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.gameState = new GameState();
    this.socketEmit = attributes.socketEmit as ISocketEmit;
    this.gameRoom = attributes.gameRoom as IGameRoom;
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
        this.syncComponents[entity.id] = this.createSyncPacket();
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
      console.log(`Deleted sync component for entity ${id}`);
      delete this.syncComponents[+id];
    });

    this.socketEmit.emitSyncPackets(
      this.gameRoom.getPlayers(),
      this.syncComponents,
      time
    );
  }

  private createSyncPacket = () => {
    return {
      pos: { x: 0, y: 0 },
      player: { color: "#000000", name: "unnamed" },
      physics: { mass: 0, velocity: new Vec2(0, 0), acceleration: new Vec2(0, 0), rotation: 0, angle: 0, drag: 0 },
      timestamp: 0
    } as IEntitySyncPacket;
  }

  private updateSyncComponent(sync: IEntitySyncPacket, entity: Entity) {
    sync.timestamp = performance.now();
    if (entity.hasComponent(CPosition)) {
      CopyUtils.copyIPosition(entity.getComponent(CPosition), sync.pos);
    }
    if (entity.hasComponent(CPlayer)) {
      CopyUtils.copyIPlayer(entity.getComponent(CPlayer), sync.player);
    }
    if (entity.hasComponent(CPhysics)) {
      CopyUtils.copyIPhysics(entity.getComponent(CPhysics), sync.physics);
    }
  }
}

ServerSyncSystem.queries = {
  all: {
    components: [CSync],
  },
};
