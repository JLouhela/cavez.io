import { System, Entity } from 'ecsy';
import { GameState } from './game_state';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';

export class SyncSystem extends System {
  private gameState: GameState;
  private syncComponents: { [entityId: number]: CNetworkSync } = {};

  execute(delta: number, time: number) {
    this.queries.all.results.forEach((entity) => {
      this.gameState.updateEntity(entity);
      const delta = this.gameState.getDelta(entity.id);
      if (!this.syncComponents[entity.id]) {
        this.syncComponents[entity.id] = new CNetworkSync();
      }

      // transmit
    });
  }

  private updateSyncComponent(csync: CNetworkSync, entity: Entity) {
    csync.pos = entity.getComponent(CPosition);
  }
}

SyncSystem.queries = {
  all: {
    components: [CPosition],
  },
};
