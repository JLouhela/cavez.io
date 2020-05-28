import { System, Entity } from 'ecsy';
import * as Protocol from '../../shared/protocol';
import { GameState } from '../game/game_state';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { EntityFactory } from '../../shared/game/entity/entity_factory';
import { SpriteCache } from '../assets/sprite_cache';
import { AssetName } from '../assets/asset_names';

export class GameStateSystem extends System {
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
      // Check if we just created our player entity
      if (
        update.player &&
        update.player.name === this.gameState.getPlayerName()
      ) {
        this.initializeClientPlayer(newEntity);
      }
    }
    this.gameState.clean();
  }

  // Proper place..?
  private initializeClientPlayer(player: Entity) {
    console.log('Found myself!');
    const spriteId = this.spriteCache.createSprite(AssetName.PLAYER_BASIC_SHIP);
    this.entityFactory.addClientPlayerComponents(player, spriteId);
    this.gameState.setPlayerId(player.id);
  }
}

GameStateSystem.queries = {
  all: {
    components: [CNetworkEntity, CNetworkSync],
  },
};
