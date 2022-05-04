import { System } from 'ecsy';
import { CPosition } from '../component/cposition.js';
import { CPhysics } from '../component/cphysics.js';
import { World, Attributes, Entity } from 'ecsy';
import * as PhysicsFunc from '../physics/physics_functions.js';

export class PhysicsSystem extends System {
  private updateAccumulator = 0.0;
  private timeStep: number = 1 / 60; // Update ratio: 60fps

  constructor(world: World<Entity>, attributes?: Attributes) {
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

  execute(delta: number, _: number) {
    this.fixedUpdate(delta);
  }
}

PhysicsSystem.queries = {
  all: {
    components: [CPosition, CPhysics],
  },
};
