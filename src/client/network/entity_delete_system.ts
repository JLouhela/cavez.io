import { System } from 'ecsy';
import { GameState } from '../game/game_state.js';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity.js';
import { SpriteCache } from '../assets/sprite_cache.js';
import { CSprite } from '../rendering/csprite.js';
import { World, Attributes, Entity } from 'ecsy';

// Delete entities not present on server any longer
export class EntityDeleteSystem extends System {
  private gameState: GameState;
  private spriteCache: SpriteCache;

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.gameState = attributes.gameState as GameState;
    this.spriteCache = attributes.spriteCache as SpriteCache;
  }

  execute(_delta: number, _time: number) {
    const latestUpdate = this.gameState.getLatestSyncEvent();
    if (latestUpdate == null) {
      return;
    }
    this.queries.all.results.forEach((entity) => {
      const serverId = entity.getComponent(CNetworkEntity).serverId;
      if (latestUpdate.entityUpdates[serverId] !== undefined) {
        return;
      }
      // Entity queried but not any longer in the gamestate
      // => can be deleted from client
      console.log(`Removed entity ${entity.id} from client`);
      const spriteComp = entity.getComponent(CSprite);
      if (spriteComp) {
        this.spriteCache.releaseSprite(spriteComp.spriteId);
      }
      entity.remove();
    });
  }
}

EntityDeleteSystem.queries = {
  all: {
    components: [CNetworkEntity],
  },
};
