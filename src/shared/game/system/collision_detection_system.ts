import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import { CCollider } from '../component/ccollider';
import { ILevelProvider } from '../level/level_provider_interface';

export class CollisionDetectionSystem extends System {
  private updateAccumulator: number = 0.0;
  private timeStep: number = 1 / 60; // Update ratio: 60fps
  private levelProvider: ILevelProvider = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.levelProvider = attributes.levelProvider;
  }

  private fixedUpdate(delta: number) {
    this.updateAccumulator += delta;
    while (this.updateAccumulator >= this.timeStep) {
      this.performUpdate(this.timeStep);
      this.updateAccumulator -= this.timeStep;
    }
  }

  private performUpdate(delta: number) {
    this.queries.all.results.forEach((entity) => {
      const collider = entity.getComponent(CCollider);
      const level = this.levelProvider.getLevel();
      // TODO setup CCollider masks
      // Check if collides with level
      // operate
    });
  }

  execute(delta: number, time: number) {
    this.fixedUpdate(delta);
  }
}

CollisionDetectionSystem.queries = {
  all: {
    components: [CCollider, CPhysics],
  },
};
