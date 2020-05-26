import { Component } from 'ecsy';
import * as KeyCode from 'keycode-js';

export class CInput extends Component {
  public keyThrottle: number;
  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.keyThrottle = -1;
  }

  copy(src: CInput) {
    this.keyThrottle = src.keyThrottle;
  }

  reset() {
    this.keyThrottle = KeyCode.KEY_UP;
  }
}
