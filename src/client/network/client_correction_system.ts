import { System } from 'ecsy';
import { GameState } from '../game/game_state';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CPosition } from '../../shared/game/component/cposition';
import { CPhysics } from '../../shared/game/component/cphysics';
import { InputHistory } from '../input/input_history';

export class ClientCorrectionSystem extends System {
  private gameState: GameState;
  private inputHistory: InputHistory = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.gameState = attributes.gameState;
    this.inputHistory = attributes.inputHistory;
  }

  execute(delta: number, time: number) {
    // TODO may not be the latest actually to be used
    const playerId = this.gameState.getPlayerId();
    if (playerId === -1) {
      // Not initialized yet.
      return;
    }
    const queryResults = this.queries.all.results;
    const player = queryResults.find((entity) => entity.id === playerId);
    if (!player) {
      console.log('Error: player id set but not found');
      return;
    }
    const latestUpdate = this.gameState.getLatest();
    if (!latestUpdate) {
      console.log('No gamestate updates yet');
      return;
    }

    const serverId = player.getComponent(CNetworkEntity).serverId;
    const syncData = latestUpdate.entityUpdates[serverId];
    if (!syncData) {
      console.log('No sync data for client in game state');
      return;
    }

    const serverPos = syncData.pos;
    const clientPos = player.getMutableComponent(CPosition);
    const serverPhys = syncData.physics;
    const clientPhys = player.getMutableComponent(CPhysics);
    const lastProcessedInput = this.gameState.getLastProcessedInput();
    if (lastProcessedInput) {
      console.log('Processed input ' + lastProcessedInput.id);
      this.gameState.setLastProcessedInput(null);
    }
    // TODO: corrections should be done based on past
    // 8. extract physics step from physics system
    // -> reset physics components to server pos
    //  -> find pos before input was sent
    //   -> rewind inputs based reseted pos timestamp
    // 9. erase unneeded data: inputs processed by server (id < received ACK), gamedata behind timestamp of received ACK
    // handle dropped input?
    // document to network_model.md
  }
}

ClientCorrectionSystem.queries = {
  all: {
    components: [CPlayer, CNetworkEntity],
  },
};
