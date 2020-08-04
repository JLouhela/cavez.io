import { System } from 'ecsy';
import { GameState } from '../game/game_state';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CPosition } from '../../shared/game/component/cposition';
import { CPhysics } from '../../shared/game/component/cphysics';

export class ClientCorrectionSystem extends System {
  private gameState: GameState;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.gameState = attributes.gameState;
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
    const latestUpdate = this.gameState.getLatest();
    if (!latestUpdate) {
      console.log('No gamestate updates yet');
      return;
    }

    const serverId = player.getComponent(CNetworkEntity).serverId;
    const syncData = latestUpdate.entityUpdates[serverId];
    if (!syncData) {
      console.log('No sync data for client in game state');
      return;
    }

    const serverPos = syncData.pos;
    const clientPos = player.getMutableComponent(CPosition);
    const serverPhys = syncData.physics;
    const clientPhys = player.getMutableComponent(CPhysics);

    // TODO: corrections should be done based on past
    // - handshake timestamps with server
    // - interpolate to matching timestamps in the past
    // - compare delta between match -> adapt current pos according to delta in history
    // Since in current state the corrections make no sense -> disabled
    // Code stored as a reference how lerp + snap can be done

    // this.correctPos(clientPos, serverPos, clientPhys);
    // this.correctAngle(clientPhys, serverPhys);
  }

  private correctPos(
    clientPos: CPosition,
    serverPos: CPosition,
    clientPhys: CPhysics
  ) {
    const posThresholdX = Math.max(10, clientPhys.velocity.x / 2);
    const posThresholdY = Math.max(10, clientPhys.velocity.y / 2);

    if (Math.abs(clientPos.x - serverPos.x) < posThresholdX) {
      clientPos.x -= (clientPos.x - serverPos.x) / 10;
    } else {
      clientPos.x = serverPos.x;
    }
    if (Math.abs(clientPos.y - serverPos.y) < posThresholdY) {
      clientPos.y -= (clientPos.y - serverPos.y) / 10;
    } else {
      clientPos.y = serverPos.y;
    }
  }

  private correctAngle(clientPhys: CPhysics, serverPhys: CPhysics) {
    const angleThreshold = 0.2;
    const normalizedClientAngle =
      clientPhys.angle < Math.PI
        ? clientPhys.angle + Math.PI
        : clientPhys.angle;
    const normalizedServerAngle =
      clientPhys.angle < Math.PI
        ? serverPhys.angle + Math.PI
        : serverPhys.angle;
    const dir = normalizedClientAngle > normalizedServerAngle ? -1 : 1;
    const absDelta = Math.abs(normalizedClientAngle - normalizedServerAngle);
    if (absDelta < angleThreshold) {
      clientPhys.angle += (dir * absDelta) / 10;
    } else {
      clientPhys.angle = serverPhys.angle;
    }
  }
}

ClientCorrectionSystem.queries = {
  all: {
    components: [CPlayer, CNetworkEntity],
  },
};
