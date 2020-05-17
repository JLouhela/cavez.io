import { Component } from 'ecsy';

export class CSprite extends Component {
  public spriteId: number;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.reset();
  }

  copy(src: CSprite) {
    this.spriteId = src.spriteId;
  }

  reset() {
    this.spriteId = -1;
  }
}
