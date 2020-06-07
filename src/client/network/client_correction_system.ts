import { System } from 'ecsy';
import { GameState } from '../game/game_state';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { CPosition } from '../../shared/game/component/cposition';

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
    const pos = player.getMutableComponent(CPosition);
    // TODO: check against server position and do something
  }
}

ClientCorrectionSystem.queries = {
  all: {
    components: [CPlayer, CNetworkEntity],
  },
};
