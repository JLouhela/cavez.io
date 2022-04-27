import { System } from 'ecsy';
import { CPosition } from '../component/cposition.js';
import { CPhysics } from '../component/cphysics.js';
import { IVec2 } from '../../math/vector.js';
import * as PhysicsFunc from '../physics/physics_functions.js';

export class PhysicsSystem extends System {
  private worldBounds: IVec2 = null;
  private updateAccumulator = 0.0;
  private timeStep: number = 1 / 60; // Update ratio: 60fps

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
  }

  private fixedUpdate(delta: number) {
    this.updateAccumulator += delta;
    while (this.updateAccumulator >= this.timeStep) {
      this.queries.all.results.forEach((entity) => {
        PhysicsFunc.physicsStep(entity, this.timeStep);
      });
      this.updateAccumulator -= this.timeStep;
    }
  }

  execute(delta: number, time: number) {
    this.fixedUpdate(delta);
  }
}

PhysicsSystem.queries = {
  all: {
    components: [CPosition, CPhysics],
  },
};
