import { System, Entity } from 'ecsy';
import * as Protocol from '../../shared/protocol';
import { GameState } from '../game/game_state';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { EntityFactory } from '../../shared/game/entity/entity_factory';

export class ClientSyncSystem extends System {
  private gameState: GameState;
  private entityFactory: EntityFactory;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.gameState = attributes.gameState;
    this.entityFactory = attributes.entityFactory;
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

      if (!found) {
        // Create entity client side
        const entity = this.entityFactory.copyNetworkEntity(update, +id);
        if (entity.id == -1) {
          console.log('Failed to create entity client side');
          return;
        }
        // Check if we just created our player entity
        if (
          update.player &&
          update.player.name === this.gameState.getPlayerName()
        ) {
          console.log('Found myself!');
          this.gameState.setPlayerId(entity.id);
        }
      } else {
        const clientId = found.getComponent(CNetworkEntity).clientId;
        console.log(
          'Found entity id ' + id + ' from client having id ' + clientId
        );
      }
    }
    this.gameState.clean();
  }
}

ClientSyncSystem.queries = {
  all: {
    components: [CNetworkEntity, CNetworkSync],
  },
};
