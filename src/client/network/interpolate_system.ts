import { System, World, Entity, Attributes } from 'ecsy';
import { GameState } from '../game/game_state.js';
import { CSync } from '../../shared/game/component/ctags.js';
import { CPosition } from '../../shared/game/component/cposition.js';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity.js';
import { CPhysics } from '../../shared/game/component/cphysics.js';
import * as CopyUtils from '../../shared/game/component/copy_utils.js';
import * as Constants from '../../shared/constants.js';

export class InterpolateSystem extends System {
  private gameState: GameState;
  private worldBounds: {
    x: number;
    xHalf: number;
    y: number;
    yHalf: number;
  } = { x: 0, y: 0, xHalf: 0, yHalf: 0 };

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.gameState = attributes.gameState as GameState;
    this.worldBounds.x = Constants.WORLD_BOUNDS.x;
    this.worldBounds.y = Constants.WORLD_BOUNDS.y;
    this.worldBounds.xHalf = this.worldBounds.x * 0.5;
    this.worldBounds.yHalf = this.worldBounds.y * 0.5;
  }

  execute(_delta: number, _time: number) {
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
        console.log(`No sync data for entity ${entity.id} (server: ${serverId}) in game state`);
        return;
      }

      const interpDeltaTime = syncDataNext.timestamp - syncDataPrev.timestamp;
      const deltaTimeNow =
        performance.now() - this.gameState.getLocalTime(syncDataNext.timestamp);
      const lerp = Math.min(1, deltaTimeNow / interpDeltaTime);
      const pos = entity.getMutableComponent(CPosition);
      CopyUtils.copyPosData(syncDataPrev.pos, pos);
      const interpX =
        (((((syncDataNext.pos.x - syncDataPrev.pos.x) % this.worldBounds.x) +
          this.worldBounds.x +
          this.worldBounds.xHalf) %
          this.worldBounds.x) -
          this.worldBounds.xHalf) *
        lerp;
      const interpY =
        (((((syncDataNext.pos.y - syncDataPrev.pos.y) % this.worldBounds.y) +
          this.worldBounds.y +
          this.worldBounds.yHalf) %
          this.worldBounds.x) -
          this.worldBounds.yHalf) *
        lerp;

      pos.x += interpX;
      pos.y += interpY;
      const phys = entity.getMutableComponent(CPhysics);
      CopyUtils.copyPhysicsData(syncDataPrev.physics, phys);
    });
  }
}

InterpolateSystem.queries = {
  all: {
    components: [CSync],
  },
};
