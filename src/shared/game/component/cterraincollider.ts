import { Component, Types } from 'ecsy';
import { Vec2 } from '../../math/vector';

export class CTerrainCollider extends Component<CTerrainCollider> {
  collisionPoints: Vec2[]; // Relative to obj center
}

CTerrainCollider.schema = {
  collisionPoints: { type: Types.Array, default: [] },
};
