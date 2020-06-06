import { System } from 'ecsy';
import { GameState } from '../game/game_state';
import { CSync } from '../../shared/game/component/ctags';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPhysics } from '../../shared/game/component/cphysics';

export class InterpolateSystem extends System {
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

    this.queries.all.results.forEach((entity) => {
      if (entity.id === playerId) {
        // Player is handled separate via prediction
        return;
      }

      const latestUpdate = this.gameState.getLatest();
      if (!latestUpdate) {
        console.log('No gamestate updates yet');
        return;
      }

      const serverId = entity.getComponent(CNetworkEntity).serverId;
      const syncData = latestUpdate.entityUpdates[serverId];
      if (!syncData) {
        console.log(
          'No sync data for entity ' +
            entity.id +
            ' (server: ' +
            serverId +
            ') in game state'
        );
        return;
      }

      // TODO interpolate: now just copies the pos as is
      entity.getMutableComponent(CPosition).copy(syncData.pos);
      entity.getMutableComponent(CPhysics).copy(syncData.physics);
    });
  }
}

InterpolateSystem.queries = {
  all: {
    components: [CSync],
  },
};
