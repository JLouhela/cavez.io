import { Component } from 'ecsy';

export class CPosition extends Component {
  public x: number;
  public y: number;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.reset();
  }

  copy(src: CPosition) {
    this.x = src.x;
    this.y = src.y;
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }
}
