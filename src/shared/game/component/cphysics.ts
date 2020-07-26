import {
  Component,
  Types,
  createType,
  copyCopyable,
  cloneClonable,
} from 'ecsy';
import { Vec2Type, Vec2 } from '../../math/vector';

export class CPhysics extends Component<CPhysics> {
  mass: number;
  velocity: Vec2;
  acceleration: Vec2;
  rotation: number;
  angle: number;
  drag: number;
}

CPhysics.schema = {
  mass: { type: Types.Number, default: 1 },
  velocity: { type: Vec2Type, default: new Vec2(0, 0) },
  acceleration: { type: Vec2Type, default: new Vec2(0, 0) },
  rotation: { type: Types.Number, default: 0.0 }, // Rad per frame
  angle: { type: Types.Number, default: 0 }, // Current direction in radians
  drag: { type: Types.Number, default: 0.1 },
};

export const CPhysicsType = createType({
  name: 'CPhysics',
  default: new Component<CPhysics>(),
  copy: copyCopyable,
  clone: cloneClonable,
});
