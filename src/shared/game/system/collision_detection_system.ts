import { System } from 'ecsy';
import { ILevelProvider } from '../level/level_provider_interface';
import { CTerrainCollider } from '../component/cterrain_collider';
import { CPosition } from '../component/cposition';
import { CPhysics } from '../component/cphysics';
import * as CollisionFunc from '../collision/collision_functions';

export class CollisionDetectionSystem extends System {
  private levelProvider: ILevelProvider = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.levelProvider = attributes.levelProvider;
  }

  // TODO think: fixed framerate or always?
  execute(delta: number, time: number) {
    this.queries.terrainColliders.results.forEach((entity) => {
      const level = this.levelProvider.getLevel();
      const collisionResult = CollisionFunc.terrainCollisionCheck(entity, level);
      if (collisionResult.collision) {
        CollisionFunc.addTerrainCollisionComponent(
          entity,
          collisionResult.localCollisionPoint,
          collisionResult.otherCollisionPoint
        );
      }
    });
  }
}

CollisionDetectionSystem.queries = {
  terrainColliders: {
    components: [CTerrainCollider, CPosition, CPhysics],
  },
};
