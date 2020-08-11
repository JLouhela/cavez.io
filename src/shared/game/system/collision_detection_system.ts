import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import { ILevelProvider } from '../level/level_provider_interface';
import * as CollisionUtils from '../../../shared/game/collision/collision_utils';
import { CTerrainCollider } from '../component/cterrain_collider';
import { Level } from '../level/level';
import { CPosition } from '../component/cposition';
import { Entity } from 'ecsy';
import { IVec2 } from '../../../shared/math/vector';

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
    this.queries.terrainColliders.results.forEach((entity) => {
      const level = this.levelProvider.getLevel();
      this.terrainCollisionCheck(entity, level);
    });
  }

  private terrainCollisionCheck(entity: Entity, level: Level) {
    const collider = entity.getComponent(CTerrainCollider);
    const pos = entity.getComponent(CPosition);

    // FIX ALLOCS BEFORE PROCEEDING! new Vec2() is a problem everywhere
    // --> provide set function and calculate normal on demand, break interface for the sake of performance
    let localCollisionPoint: IVec2 = null;
    let terrainCollisoinPoint: IVec2 = null;
    let collision: boolean = false;
    collider.collisionPoints.forEach((point) => {
      const terrainPoint = { x: point.x + pos.x, y: point.y + pos.y };
      if (level.isSolid(terrainPoint)) {
        collision = true;
        localCollisionPoint = point;
        terrainCollisoinPoint = terrainPoint;
        return;
      }
    });
    if (collision) {
      this.addTerrainCollisionComponent(
        entity,
        localCollisionPoint,
        terrainCollisoinPoint
      );
    }
  }

  private addTerrainCollisionComponent(
    entity: Entity,
    localCollisionPoint: IVec2,
    terrainCollisionPoint: IVec2
  ) {}

  execute(delta: number, time: number) {
    this.fixedUpdate(delta);
  }
}

CollisionDetectionSystem.queries = {
  terrainColliders: {
    components: [CTerrainCollider, CPhysics],
  },
};
