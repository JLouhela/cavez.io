import { Component, Types } from 'ecsy';
import { IVec2 } from '../../math/vector';

export class CTerrainCollider extends Component<CTerrainCollider> {
  collisionPoints: IVec2[]; // Relative to obj center
}

CTerrainCollider.schema = {
  collisionPoints: { type: Types.Array, default: [] },
};
