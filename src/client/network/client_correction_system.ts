import { System } from 'ecsy';
import { GameState } from '../game/game_state';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
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

    // TODO: Only correct after receiving ack for input?
    this.correctPos(clientPos, serverPos, clientPhys);
    this.correctAngle(clientPhys, serverPhys);
  }

  private correctPos(
    clientPos: CPosition,
    serverPos: CPosition,
    clientPhys: CPhysics
  ) {
    // Use velocity to adapt pos threshold
    const posThresholdX = Math.max(10, clientPhys.velocity.x / 5);
    const posThresholdY = Math.max(10, clientPhys.velocity.y / 5);

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
      clientPhys.angle < 180 ? clientPhys.angle : clientPhys.angle + 180;
    const normalizedServerAngle =
      clientPhys.angle < 180 ? serverPhys.angle : serverPhys.angle + 180;
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
