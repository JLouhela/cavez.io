import { System, Entity } from 'ecsy';
import { GameState } from '../game/game_state';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPlayer } from '../../shared/game/component/cplayer';
import { EntityFactory } from '../../shared/game/entity/entity_factory';
import { SpriteCache } from '../assets/sprite_cache';
import { AssetName } from '../assets/asset_names';

export class EntityInitSystem extends System {
  private gameState: GameState;
  private entityFactory: EntityFactory;
  private spriteCache: SpriteCache;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.gameState = attributes.gameState;
    this.entityFactory = attributes.entityFactory;
    this.spriteCache = attributes.spriteCache;
  }

  execute(delta: number, time: number) {
    // TODO may not be the latest actually to be used
    const latestUpdate = this.gameState.getLatest();
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
      console.log('Created new entity: id ' + newEntity.id);
      // Check if we just created our player entity
      if (update.player) {
        this.initializePlayer(newEntity);
      }
    }
    this.gameState.clean();
  }

  // Proper place..?
  private initializePlayer(player: Entity) {
    console.log('Found myself! player id = ' + player.id);
    const spriteId = this.spriteCache.createSprite(AssetName.PLAYER_BASIC_SHIP);
    this.entityFactory.addPlayerComponents(player, spriteId);
    if (player.getComponent(CPlayer).name === this.gameState.getPlayerName()) {
      this.entityFactory.addClientPlayerComponents(player, spriteId);
      this.gameState.setPlayerId(player.id);
    }
  }
}

EntityInitSystem.queries = {
  all: {
    components: [CNetworkEntity],
  },
};
