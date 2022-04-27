import { Component, Types } from 'ecsy';
import { IVec2 } from '../../math/vector.js';

export class CTerrainCollider extends Component<CTerrainCollider> {
  collisionPoints: IVec2[]; // Relative to obj center
}

CTerrainCollider.schema = {
  collisionPoints: { type: Types.Array, default: [] },
};
