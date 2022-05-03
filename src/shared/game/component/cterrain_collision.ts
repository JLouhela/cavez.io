import { Component, Types } from 'ecsy';
import { Vec2, Vec2Type } from '../../math/vector.js';

// Raw numbers to avoid allocations on each collider addition
export class CTerrainCollision extends Component<CTerrainCollision> {
  declare localPoint: Vec2; // Relative to obj center
  declare terrainPoint: Vec2;
}

CTerrainCollision.schema = {
  localPoint: { type: Vec2Type, default: new Vec2(-999, -999) },
  terrainPoint: { type: Vec2Type, default: new Vec2(-999, -999) },
};
