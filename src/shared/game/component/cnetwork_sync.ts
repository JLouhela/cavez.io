import { CPosition } from './cposition';
import { Component } from 'ecsy';

export class CNetworkSync extends Component {
  public pos: CPosition;
  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.pos = null;
  }

  copy(src: CNetworkSync) {
    this.pos = src.pos;
  }

  reset() {
    this.pos = new CPosition();
  }
}
