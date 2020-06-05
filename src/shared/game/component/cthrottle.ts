import { Component } from 'ecsy';

export class CThrottle extends Component {
  public throttlePower: number;
  public throttleOn: boolean;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.throttlePower = 0.0;
    this.throttleOn = false;
  }

  copy(src: CThrottle) {
    this.throttlePower = src.throttlePower;
    this.throttleOn = src.throttleOn;
  }

  reset() {
    this.throttlePower = 0.0;
    this.throttleOn = false;
  }
}
