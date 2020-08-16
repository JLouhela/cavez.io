import { CollisionMaskType } from './collision_mask_types';

export function collidesWith(
  mask: number,
  collisionType: CollisionMaskType
): boolean {
  return (mask & collisionType) > 0;
}
