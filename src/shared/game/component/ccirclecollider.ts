import { Component, Types } from 'ecsy';
import { CollisionMaskType } from '../collision/collision_mask_types';

export class CCircleCollider extends Component<CCircleCollider> {
  collisionMask: number;
  ownType: CollisionMaskType;
  radius: number;
}

CCircleCollider.schema = {
  collisionMask: { type: Types.Number, default: 0 },
  colliderType: { type: Types.Number, default: 0 },
  radius: { type: Types.Number, default: 1.0 },
};
