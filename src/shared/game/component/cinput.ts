import { Component } from 'ecsy';
import * as KeyCode from 'keycode-js';

export class CInput extends Component {
  public keyThrottle: number;
  public keyRotCW: number;
  public keyRotCCW: number;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.keyThrottle = -1;
    this.keyRotCCW = -1;
    this.keyRotCW = -1;
  }

  copy(src: CInput) {
    this.keyThrottle = src.keyThrottle;
    this.keyRotCW = src.keyRotCW;
    this.keyRotCCW = src.keyRotCCW;
  }

  reset() {
    this.keyThrottle = KeyCode.KEY_UP;
    this.keyRotCCW = KeyCode.KEY_LEFT;
    this.keyRotCW = KeyCode.KEY_RIGHT;
  }
}
