import { CPosition } from './cposition';
import { Component } from 'ecsy';
import { CPlayer } from './cplayer';

export class CNetworkSync extends Component {
  public pos: CPosition;
  public player: CPlayer;
  public entityId: number;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.pos = null;
    this.player = null;
    this.entityId = -1;
  }

  copy(src: CNetworkSync) {
    this.pos = src.pos;
    this.player = src.player;
    this.entityId = src.entityId;
  }

  reset() {
    this.pos = null;
    this.player = null;
    this.entityId = -1;
  }
}
