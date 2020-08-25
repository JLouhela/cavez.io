import { System } from 'ecsy';
import { CInput } from '../../shared/game/component/cinput';
import { CThrottle } from '../../shared/game/component/cthrottle';
import { IInputReader } from './input_reader';
import { ISocketEmit } from '../network/geckos_socket_handler';
import * as Protocol from '../../shared/protocol';
import * as Constants from '../../shared/constants';
import { CPhysics } from '../../shared/game/component/cphysics';
import { InputHistory } from './input_history';

export class InputReadSystem extends System {
  private inputReader: IInputReader = null;
  private socketEmit: ISocketEmit = null;
  private inputHistory: InputHistory = null;
  private prevInputState: number = 0x00;

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

      if (inputState !== this.prevInputState) {
        this.inputHistory.storeInput(inputState);
        this.socketEmit.sendInputState(inputState);
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
      throttleComp.throttleOn = true;
      throttleComp.throttlePower =
        Constants.SHIP_THROTTLE_PER_MASS / physicsComp.mass;
    } else {
      throttleComp.throttleOn = false;
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
      physicsComp.rotation =
        (physicsComp.mass / Constants.SHIP_ROTATION_PER_MASS_INVERSE) * Math.PI;
    } else if (this.inputReader.isKeyDown(keyCCW)) {
      inputState = inputState | Protocol.INPUT_MASK.ROT_CCW;
      physicsComp.rotation =
        (-physicsComp.mass / Constants.SHIP_ROTATION_PER_MASS_INVERSE) *
        Math.PI;
    } else {
      physicsComp.rotation = 0;
    }

    return inputState;
  }
}

InputReadSystem.queries = {
  client: {
    components: [CInput, CThrottle, CPhysics],
  },
};
