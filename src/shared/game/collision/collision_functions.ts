import { CollisionMaskType } from './collision_mask_types.js';
import { Entity } from 'ecsy';
import { Level } from '../level/level.js';
import { CTerrainCollider } from '../component/cterrain_collider.js';
import { CPosition } from '../component/cposition.js';
import { CPhysics } from '../component/cphysics.js';
import { IVec2, Vec2 } from '../../../shared/math/vector.js';
import * as MathUtils from '../../../shared/math/math_utils.js';
import { CTerrainCollision } from '../component/cterrain_collision.js';

export interface ICollisionResult {
  collision: boolean;
  localCollisionPoint: IVec2;
  otherCollisionPoint: IVec2;
}

export function collidesWith(
  mask: number,
  collisionType: CollisionMaskType
): boolean {
  return (mask & collisionType) > 0;
}

export function addTerrainCollisionComponent(
  entity: Entity,
  localCollisionPoint: IVec2,
  terrainCollisionPoint: IVec2
) {
  if (entity.hasComponent(CTerrainCollision)) {
    console.log(
      'Entity ' + entity.id + ' has already unresolved terrain collision!'
    );
    return;
  }
  entity.addComponent(CTerrainCollision, {
    localPoint: new Vec2(localCollisionPoint.x, localCollisionPoint.y),
    terrainPoint: new Vec2(terrainCollisionPoint.x, terrainCollisionPoint.y),
  });
}

// Call only from systems!
export function terrainCollisionCheck(
  entity: Entity,
  level: Level
): ICollisionResult {
  const collider = entity.getComponent(CTerrainCollider);
  const pos = entity.getComponent(CPosition);
  const phys = entity.getComponent(CPhysics);

  let localCollisionPoint: IVec2 = null;
  let terrainCollisionPoint: IVec2 = null;
  let collision: boolean = false;
  collider.collisionPoints.forEach((point) => {
    const rotatedCollisionPoint = MathUtils.rotatePoint(point, phys.angle);
    const terrainPoint = {
      x: rotatedCollisionPoint.x + pos.x,
      y: rotatedCollisionPoint.y + pos.y,
    };
    if (level.isSolid(terrainPoint)) {
      collision = true;
      localCollisionPoint = point;
      terrainCollisionPoint = terrainPoint;
      return;
    }
  });
  return {
    collision,
    localCollisionPoint,
    otherCollisionPoint: terrainCollisionPoint,
  };
}

export function resolveTerrainCollision(
  entity: Entity,
  localCollisionPoint: IVec2,
  terrainCollisionPoint: IVec2,
  delta: number
) {
  const pos = entity.getMutableComponent(CPosition);
  const phys = entity.getMutableComponent(CPhysics);

  // TODO Handle collisions properly
  // -> Angular velocity not handled
  // -> Impact point not taken into account
  // -> Pretty much works only with a single point collision, otherwise you can get stuck by rotating
  // -> Can go through the ground too if snap doesn't get you out of ground
  pos.x -= phys.velocity.x * 2 * delta;
  pos.y -= phys.velocity.y * 2 * delta;
  phys.velocity.set(0, 0);
}
