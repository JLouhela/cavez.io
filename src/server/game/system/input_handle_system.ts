import { System } from 'ecsy';
import { CThrottle } from '../../../shared/game/component/cthrottle';
import { CPhysics } from '../../../shared/game/component/cphysics';
import { InputManager } from '../input_manager';
import { CSocket } from '../../socket/csocket';
import * as Protocol from '../../../shared/protocol';
import * as Constants from '../../../shared/constants';

export class InputHandleSystem extends System {
  private inputManager: InputManager = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.inputManager = attributes.inputManager;
  }

  execute(delta: number, time: number) {
    this.queries.client.results.forEach((entity) => {
      const throttle = entity.getMutableComponent(CThrottle);
      const physics = entity.getMutableComponent(CPhysics);
      const socketId = entity.getComponent(CSocket).socketId;

      const inputBuffer = this.inputManager.getInputEvents(socketId);
      if (inputBuffer && inputBuffer.length > 0) {
        // Process all buffered inputs:
        // Rot CW and Rot CCW cancel each other out -> calculate delta based on timestamps
        // Throttle: calculate time throttle was on ->_ set on and adjust force
        this.handleThrottle(throttle, physics, inputBuffer);
      }

      this.inputManager.eraseInputs(socketId);
    });
  }

  private handleThrottle(
    throttleComp: CThrottle,
    physicsComp: CPhysics,
    inputBuffer: Protocol.IInputUpdateEvent[]
  ) {
    // Empty checked before calling
    // Length 1: toggle on / off
    if (inputBuffer.length === 1) {
      throttleComp.throttleOn =
        (inputBuffer[0].keyMask & Protocol.INPUT_MASK.THROTTLE) > 0;
      throttleComp.throttlePower =
        Constants.SHIP_THROTTLE_PER_MASS / physicsComp.mass;
      return;
    }
    // Multiple inputs: calculate how long button has been pressed
    // This is very likely bullshit
    let throttleOn =
      (inputBuffer[0].keyMask & Protocol.INPUT_MASK.THROTTLE) > 0;
    let throttleTime = 0;
    let ts = inputBuffer[0].timestamp;
    for (let i = 1; i < inputBuffer.length; ++i) {
      if (throttleOn) {
        throttleTime += inputBuffer[i].timestamp - inputBuffer[i - 1].timestamp;
      }
      ts = inputBuffer[i].timestamp;
      throttleOn = (inputBuffer[i].keyMask & Protocol.INPUT_MASK.THROTTLE) > 0;
    }
    if (throttleTime > 0) {
      // Just test something
      throttleComp.throttleOn = throttleOn;
      throttleComp.throttlePower =
        (Constants.SHIP_THROTTLE_PER_MASS / physicsComp.mass) *
        Constants.SERVER_WORLD_STEP_RATE;
    }
  }
}

InputHandleSystem.queries = {
  client: {
    components: [CSocket, CThrottle, CPhysics],
  },
};
