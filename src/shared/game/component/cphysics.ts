import { Component } from 'ecsy';
import { Vec2 } from '../../math/vector';

export class CPhysics extends Component {
  public mass: number;
  public velocity: Vec2;
  public acceleration: Vec2;
  public rotation: number; // Rad per frame
  public angle: number; // Current direction in radians
  public drag: number;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.mass = 0.0;
    this.velocity = new Vec2(0.0, 0.0);
    this.acceleration = new Vec2(0.0, 0.0);
    this.rotation = 0.0;
    this.angle = 0;
    this.drag = 0;
  }

  copy(src: CPhysics) {
    this.mass = src.mass;
    this.velocity = src.velocity;
    this.acceleration = src.acceleration;
    this.rotation = src.rotation;
    this.angle = src.angle;
    this.drag = src.drag;
  }

  reset() {
    this.mass = 1.0;
    this.velocity = new Vec2(0.0, 0.0);
    this.acceleration = new Vec2(0.0, 0.0);
    this.rotation = 0.0;
    this.angle = 0;
    this.drag = 0.1;
  }
}
