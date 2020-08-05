import { Component, Types } from 'ecsy';

export class CCollider extends Component<CCollider> {
  collisionMask: number;
}

CCollider.schema = {
  collisionMask: { type: Types.Number, default: 0 },
};
