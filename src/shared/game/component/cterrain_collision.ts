import { Component, Types } from 'ecsy';

// Raw numbers to avoid allocations on each collider addition
export class CTerrainCollision extends Component<CTerrainCollision> {
  localPointX: number; // Relative to obj center
  localPointY: number; // Relative to obj center
  terrainPointX: number;
  terrainPointY: number;
}

CTerrainCollision.schema = {
  localPointX: { type: Types.Number, default: -999 },
  localPointY: { type: Types.Number, default: -999 },
  terrainPointX: { type: Types.Number, default: -1 },
  terrainPointY: { type: Types.Number, default: -1 },
};
