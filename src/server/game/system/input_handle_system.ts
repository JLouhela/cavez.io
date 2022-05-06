import { System, Entity, Attributes, World } from 'ecsy';
import { CThrottle } from '../../../shared/game/component/cthrottle.js';
import { CPhysics } from '../../../shared/game/component/cphysics.js';
import { InputManager } from '../input_manager.js';
import { CSocket } from '../../socket/csocket.js';
import { ISocketEmit } from '../../socket/socket_emit_interface.js';
import { IGameRoom } from '../../room/game_room.js';
import * as InputFunc from '../../../shared/game/input/input_functions.js';

export class InputHandleSystem extends System {
  private inputManager: InputManager = null;
  private socketEmit: ISocketEmit;
  // Bit of a code smell: game room contains systems which refer to game room
  private gameRoom: IGameRoom;
  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.inputManager = attributes.inputManager as InputManager;
    this.socketEmit = attributes.socketEmit as ISocketEmit;
    this.gameRoom = attributes.gameRoom as IGameRoom;
  }

  execute(_delta: number, _time: number) {
    this.queries.client.results.forEach((entity) => {
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
    // Needed in executeInput!
    components: [CSocket, CThrottle, CPhysics],
  },
};
