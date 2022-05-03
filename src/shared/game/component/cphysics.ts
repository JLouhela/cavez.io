import {
  Component,
  Types
} from 'ecsy';

import { Vec2Type, Vec2 } from '../../math/vector.js';

export class CPhysics extends Component<CPhysics> {
  declare mass: number;
  declare velocity: Vec2;
  declare acceleration: Vec2;
  declare rotation: number;
  declare angle: number;
  declare drag: number;
}

CPhysics.schema = {
  mass: { type: Types.Number, default: 1 },
  velocity: { type: Vec2Type, default: new Vec2(0, 0) },
  acceleration: { type: Vec2Type, default: new Vec2(0, 0) },
  rotation: { type: Types.Number, default: 0.0 }, // Rad per frame
  angle: { type: Types.Number, default: 0 }, // Current direction in radians
  drag: { type: Types.Number, default: 0.1 },
}
