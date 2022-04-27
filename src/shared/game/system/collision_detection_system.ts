import { System } from 'ecsy';
import { ILevelProvider } from '../level/level_provider_interface.js';
import { CTerrainCollider } from '../component/cterrain_collider.js';
import { CPosition } from '../component/cposition.js';
import { CPhysics } from '../component/cphysics.js';
import * as CollisionFunc from '../collision/collision_functions.js';

export class CollisionDetectionSystem extends System {
  private levelProvider: ILevelProvider = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.levelProvider = attributes.levelProvider;
  }

  execute(delta: number, time: number) {
    this.queries.terrainColliders.results.forEach((entity) => {
      const level = this.levelProvider.getLevel();
      const collisionResult = CollisionFunc.terrainCollisionCheck(
        entity,
        level
      );
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
