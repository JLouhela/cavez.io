import { System, World, Entity, Attributes } from 'ecsy';
import { CInput } from '../../shared/game/component/cinput.js';
import { CThrottle } from '../../shared/game/component/cthrottle.js';
import { IInputReader } from './input_reader.js';
import { ISocketEmit } from '../network/geckos_socket_handler.js';
import * as Protocol from '../../shared/protocol.js';
import { CPhysics } from '../../shared/game/component/cphysics.js';
import { InputHistory } from './input_history.js';
import * as InputFunc from '../../shared/game/input/input_functions.js';

export class InputReadSystem extends System {
  private inputReader: IInputReader = null;
  private socketEmit: ISocketEmit = null;
  private inputHistory: InputHistory = null;
  private prevInputState = 0x00;
  private sequenceNumber = 0;

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.inputReader = attributes.inputReader as IInputReader;
    this.socketEmit = attributes.socketEmit as ISocketEmit;
    this.inputHistory = attributes.inputHistory as InputHistory;
  }

  execute(_delta: number, _time: number) {
    this.queries.client.results.forEach((entity) => {
      const inputComp = entity.getComponent(CInput);
      const throttle = entity.getMutableComponent(CThrottle);
      const physics = entity.getMutableComponent(CPhysics);
      let inputState = 0x00;
      inputState = this.handleThrottle(
        0x00,
        throttle,
        physics,
        inputComp.keyThrottle
      );

      inputState = this.handleRotate(
        inputState,
        physics,
        inputComp.keyRotCW,
        inputComp.keyRotCCW
      );

      InputFunc.executeInput(entity, inputState);

      if (inputState !== this.prevInputState) {
        this.inputHistory.storeInput(inputState, this.sequenceNumber);
        this.socketEmit.sendInputState(inputState, this.sequenceNumber);
        this.sequenceNumber++;
      }
      this.prevInputState = inputState;
    });
  }

  private handleThrottle(
    inputState: number,
    throttleComp: CThrottle,
    physicsComp: CPhysics,
    key: number
  ): number {
    if (this.inputReader.isKeyDown(key)) {
      inputState = inputState | Protocol.INPUT_MASK.THROTTLE;
    }
    return inputState;
  }

  private handleRotate(
    inputState: number,
    physicsComp: CPhysics,
    keyCW: number,
    keyCCW: number
  ): number {
    if (this.inputReader.isKeyDown(keyCW)) {
      inputState = inputState | Protocol.INPUT_MASK.ROT_CW;
    } else if (this.inputReader.isKeyDown(keyCCW)) {
      inputState = inputState | Protocol.INPUT_MASK.ROT_CCW;
    }
    return inputState;
  }
}

InputReadSystem.queries = {
  client: {
    components: [CInput, CThrottle, CPhysics],
  },
};
