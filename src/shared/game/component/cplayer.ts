import { Component } from 'ecsy';

export class CPlayer extends Component {
  public color: string;
  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.color = '';
  }

  copy(src: CPlayer) {
    this.color = src.color;
  }

  reset() {
    this.color = '#000000';
  }
}
