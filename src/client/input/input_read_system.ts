import { System } from 'ecsy';
import { CInput } from '../../shared/game/component/cinput';
import { CThrottle } from '../../shared/game/component/cthrottle';
import { IInputReader } from './input_reader';
import { ISocketEmit } from '../network/geckos_socket_handler';
import * as Protocol from '../../shared/protocol';
import * as Constants from '../../shared/constants';
import { CPhysics } from '../../shared/game/component/cphysics';
import { InputHistory } from './input_history';
import * as InputFunc from '../../shared/game/input/input_functions';

export class InputReadSystem extends System {
  private inputReader: IInputReader = null;
  private socketEmit: ISocketEmit = null;
  private inputHistory: InputHistory = null;
  private prevInputState: number = 0x00;
  private sequenceNumber: number = 0;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.inputReader = attributes.inputReader;
    this.socketEmit = attributes.socketEmit;
    this.inputHistory = attributes.inputHistory;
  }

  execute(delta: number, time: number) {
    this.queries.client.results.forEach((entity) => {
      const inputComp = entity.getComponent(CInput);
      const throttle = entity.getMutableComponent(CThrottle);
      const physics = entity.getMutableComponent(CPhysics);
      let inputState: number = 0x00;
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
