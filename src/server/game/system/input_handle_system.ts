import { System } from 'ecsy';
import { CThrottle } from '../../../shared/game/component/cthrottle';
import { CPhysics } from '../../../shared/game/component/cphysics';
import { InputManager } from '../input_manager';
import { CSocket } from '../../socket/csocket';
import * as Protocol from '../../../shared/protocol';
import * as Constants from '../../../shared/constants';
import { ISocketEmit } from '../../socket/socket_emit_interface';
import { IGameRoom } from '../../room/game_room';
import * as InputFunc from '../../../shared/game/input/input_functions';

export class InputHandleSystem extends System {
  private inputManager: InputManager = null;
  private socketEmit: ISocketEmit;
  // Bit of a code smell: game room contains systems which refer to game room
  private gameRoom: IGameRoom;
  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.inputManager = attributes.inputManager;
    this.socketEmit = attributes.socketEmit;
    this.gameRoom = attributes.gameRoom;
  }

  execute(delta: number, time: number) {
    this.queries.client.results.forEach((entity) => {
      const throttle = entity.getMutableComponent(CThrottle);
      const physics = entity.getMutableComponent(CPhysics);
      const socketId = entity.getComponent(CSocket).socketId;

      const inputBuffer = this.inputManager.getInputEvents(socketId);
      if (inputBuffer && inputBuffer.length > 0) {
        // TODO: use free functions
        // TODO: What if there are multiple inputs buffered? now just drops earlier input
        InputFunc.executeInput(
          entity,
          inputBuffer[inputBuffer.length - 1].keyMask
        );
        // TODO: find socket instead of socketid
        this.socketEmit.emitInputProcessed(
          this.gameRoom.getPlayer(socketId).socket,
          {
            id: inputBuffer[inputBuffer.length - 1].id,
          }
        );
      }

      this.inputManager.eraseInputs(socketId);
    });
  }
}

InputHandleSystem.queries = {
  client: {
    components: [CSocket, CThrottle, CPhysics],
  },
};
