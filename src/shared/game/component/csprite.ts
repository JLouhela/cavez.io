import { Component } from 'ecsy';

export class CSprite extends Component {
  public spriteId: number;
  public hue: number;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.reset();
  }

  copy(src: CSprite) {
    this.spriteId = src.spriteId;
    this.hue = src.hue;
  }

  reset() {
    this.spriteId = -1;
    this.hue = 0xffffff;
  }
}
