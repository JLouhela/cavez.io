import { System } from 'ecsy';
import { CThrottle } from '../../../shared/game/component/cthrottle';
import { CPhysics } from '../../../shared/game/component/cphysics';
import { InputManager } from '../input_manager';
import { CSocket } from '../../socket/csocket';

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

      const curTime = performance.now();
      const inputBuffer = this.inputManager.getInputEvents(socketId);
      // Process all buffered inputs:
      // Rot CW and Rot CCW cancel each other out -> calculate delta based on timestamps
      // Throttle: calculate time throttle was on ->_ set on and adjust force
      console.log(inputBuffer);
      this.inputManager.eraseInputs(socketId, performance.now());
    });
  }
}

InputHandleSystem.queries = {
  client: {
    components: [CSocket, CThrottle, CPhysics],
  },
};
