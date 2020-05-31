import { Component } from 'ecsy';
import { Vec2 } from '../../math/vector';

export class CThrottle extends Component {
  public throttleForce: Vec2;
  public throttleOn: boolean;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.throttleForce = new Vec2(0.0, 0.0);
    this.throttleOn = false;
  }

  copy(src: CThrottle) {
    this.throttleForce = src.throttleForce;
    this.throttleOn = src.throttleOn;
  }

  reset() {
    this.throttleForce = new Vec2(0.0, 0.0);
    this.throttleOn = false;
  }
}
