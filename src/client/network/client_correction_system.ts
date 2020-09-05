import { System } from 'ecsy';
import { GameState } from '../game/game_state';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CPosition } from '../../shared/game/component/cposition';
import { CPhysics } from '../../shared/game/component/cphysics';
import { InputHistory } from '../input/input_history';
import * as PhysicsFunc from '../../shared/game/physics/physics_functions';
import * as CollisionFunc from '../../shared/game/collision/collision_functions';
import { ILevelProvider } from '../../shared/game/level/level_provider_interface';

export class ClientCorrectionSystem extends System {
  private gameState: GameState;
  private inputHistory: InputHistory = null;
  private lastCorrectionTime: number = null;
  private levelProvider: ILevelProvider = null;
  private forceCorrectionMS: number = 100;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.gameState = attributes.gameState;
    this.inputHistory = attributes.inputHistory;
    this.levelProvider = attributes.levelProvider;
  }

  execute(delta: number, time: number) {
    // TODO may not be the latest actually to be used
    const playerId = this.gameState.getPlayerId();
    if (playerId === -1) {
      // Not initialized yet.
      return;
    }
    const queryResults = this.queries.all.results;
    const player = queryResults.find((entity) => entity.id === playerId);
    if (!player) {
      console.log('Error: player id set but not found');
      return;
    }

    // No input update, no need to do anything
    // TODO force update still at certain intervals?
    const lastProcessedInput = this.gameState.getLastProcessedInput();
    const forceUpdate =
      performance.now() - this.lastCorrectionTime > this.forceCorrectionMS;
    if (!lastProcessedInput && !forceUpdate) {
      return;
    }

    let syncPacket = null;
    if (lastProcessedInput) {
      const inputTimestamp = this.inputHistory.getInputById(
        lastProcessedInput.id
      ).timestamp;
      const inputTimestampServer = this.gameState.getServerTime(inputTimestamp);
      syncPacket = this.gameState.getSyncEvent(inputTimestampServer);
    } else {
      syncPacket = this.gameState.getLatestSyncEvent();
    }

    if (!syncPacket) {
      return;
    }

    const serverId = player.getComponent(CNetworkEntity).serverId;

    const syncData = syncPacket.entityUpdates[serverId];
    if (!syncData) {
      console.log('No sync data for client in game state');
      return;
    }

    const clientPos = player.getMutableComponent(CPosition);
    const clientPhys = player.getMutableComponent(CPhysics);
    clientPos.copy(syncData.pos);
    clientPhys.copy(syncData.physics);

    const fps = 1 / 60;
    let correctTime = this.gameState.getLocalTime(syncPacket.timestamp) + fps;
    const currentTime = performance.now();
    // why getlocaltime = 0
    while (correctTime < currentTime) {
      PhysicsFunc.physicsStep(player, fps);
      /*  CollisionFunc.terrainCollisionCheck(
        player,
        this.levelProvider.getLevel()
      );
      CollisionFunc.resolveTerrainCollision(player, fps);
      */ correctTime +=
        fps * 1000;
    }
    // 9. erase unneeded data: inputs processed by server (id < received ACK), gamedata behind timestamp of received ACK
    // handle dropped input?
    // document to network_model.md
    // 10. reset other entities too?
    this.gameState.setLastProcessedInput(null);
    this.gameState.removeSyncEvents(syncPacket.timestamp);
    // TODO erase input history, not only last processed input
    this.lastCorrectionTime = performance.now();
  }
}

ClientCorrectionSystem.queries = {
  all: {
    components: [CPlayer, CNetworkEntity],
  },
};
