import { System, Entity, World, Attributes } from 'ecsy';
import { GameState } from '../game/game_state.js';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity.js';
import { CPlayer } from '../../shared/game/component/cplayer.js';
import { EntityFactory } from '../../shared/game/entity/entity_factory.js';
import { SpriteCache } from '../assets/sprite_cache.js';
import { AssetName } from '../assets/asset_names.js';
import { CTerrainCollider } from '../../shared/game/component/cterrain_collider.js';

export class EntityInitSystem extends System {
  private gameState: GameState;
  private entityFactory: EntityFactory;
  private spriteCache: SpriteCache;

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.gameState = attributes.gameState as GameState;
    this.entityFactory = attributes.entityFactory as EntityFactory;
    this.spriteCache = attributes.spriteCache as SpriteCache;
  }

  execute(_delta: number, _time: number) {
    // TODO may not be the latest actually to be used
    const latestUpdate = this.gameState.getLatestSyncEvent();
    if (latestUpdate == null) {
      return;
    }
    const queryResults = this.queries.all.results;
    for (const [id, update] of Object.entries(latestUpdate.entityUpdates)) {
      const found = queryResults.find(
        // op+ silently converts to number
        (entity) => entity.getComponent(CNetworkEntity).serverId === +id
      );

      if (found) {
        // This system does not operate on existing entities
        continue;
      }
      // Create entity client side
      const newEntity = this.entityFactory.copyNetworkEntity(update, +id);
      if (!newEntity) {
        console.log('Failed to create entity client side');
        return;
      }
      console.log(`Created new entity: id ${newEntity.id}`);
      // Check if we just created our player entity
      if (update.player) {
        this.initializePlayer(newEntity);
      }
    }
  }

  // Proper place..?
  private initializePlayer(player: Entity) {
    console.log(`New player! player id = ${player.id}`);
    const spriteId = this.spriteCache.createSprite(AssetName.PLAYER_BASIC_SHIP);
    this.entityFactory.addPlayerComponents(player, spriteId);
    if (player.getComponent(CPlayer).name === this.gameState.getPlayerName()) {
      console.log(`Player ${player.id} identified as the client`);
      this.entityFactory.addClientPlayerComponents(player);
      this.gameState.setPlayerId(player.id);
    } else {
      // Terrain collider not needed for other players
      console.log(`No terrain collider needed for player ${player.id}`);
      player.removeComponent(CTerrainCollider);
    }
  }
}

EntityInitSystem.queries = {
  all: {
    components: [CNetworkEntity],
  },
};
