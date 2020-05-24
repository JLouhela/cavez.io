import { System, Entity } from 'ecsy';
import * as Protocol from '../../shared/protocol';
import { GameState } from '../game/game_state';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkEntity } from '../game/component/cnetwork_entity';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';

export class ClientSyncSystem extends System {
  private gameState: GameState;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.gameState = attributes.gameState;
  }

  execute(delta: number, time: number) {
    // TODO may not be the latest actually to be used
    const latestUpdate = this.gameState.getLatest();
    if (latestUpdate == null) {
      return;
    }
    const queryResults = this.queries.all.results;
    for (const [id, update] of Object.entries(latestUpdate.entityUpdates)) {
      console.log(id, update);
      // TODO find match from queryResults
    }
  }
}

ClientSyncSystem.queries = {
  all: {
    components: [CNetworkEntity, CNetworkSync],
  },
};
