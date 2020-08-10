import { Component, Types } from 'ecsy';
import { Vec2 } from '../../math/vector';
import { Vec2Type } from '../../math/vector';

export class CTerrainCollision extends Component<CTerrainCollision> {
  collisionPointLocal: Vec2; // Relative to obj center
  collisionPointTerrain: Vec2; // Relative to obj center
}

CTerrainCollision.schema = {
  collisionPoints: { type: Vec2Type, default: new Vec2(0, 0) },
};
