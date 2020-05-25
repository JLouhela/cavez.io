import { Component } from 'ecsy';

export class CPlayer extends Component {
  public color: string;
  public name: string;
  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.color = '';
    this.name = '';
  }

  copy(src: CPlayer) {
    this.color = src.color;
    this.name = src.name;
  }

  reset() {
    this.color = '#000000';
    this.name = '';
  }
}
