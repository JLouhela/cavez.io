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

      const interpolateState = this.gameState.getInterpolateState();
      if (!interpolateState) {
        console.log('No gamestate updates yet');
        return;
      }

      const serverId = entity.getComponent(CNetworkEntity).serverId;
      const syncDataPrev = interpolateState.previous.entityUpdates[serverId];
      const syncDataNext = interpolateState.next.entityUpdates[serverId];
      if (!syncDataPrev || !syncDataNext) {
        console.log(
          'No sync data for entity ' +
            entity.id +
            ' (server: ' +
            serverId +
            ') in game state'
        );
        return;
      }

      const interpDeltaTime = syncDataNext.timestamp - syncDataPrev.timestamp;
      const deltaTimeNow =
        performance.now() - this.gameState.getLocalTime(syncDataNext.timestamp);
      const lerp = Math.min(1, deltaTimeNow / interpDeltaTime);
      const pos = entity.getMutableComponent(CPosition);
      pos.copy(syncDataPrev.pos);
      pos.x += (syncDataNext.pos.x - syncDataPrev.pos.x) * lerp;
      pos.y += (syncDataNext.pos.y - syncDataPrev.pos.y) * lerp;

      const phys = entity.getMutableComponent(CPhysics);
      phys.copy(syncDataPrev.physics);
    });
  }
}

InterpolateSystem.queries = {
  all: {
    components: [CSync],
  },
};
