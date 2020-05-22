import { CPosition } from './cposition';
import { Component } from 'ecsy';

export class CNetworkSync extends Component {
  public pos: CPosition;
  public entityId: any;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.pos = null;
    this.entityId = -1;
  }

  copy(src: CNetworkSync) {
    this.pos = src.pos;
    this.entityId = src.entityId;
  }

  reset() {
    this.pos = new CPosition();
    this.entityId = -1;
  }
}
