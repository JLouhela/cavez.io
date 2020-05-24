import { Component } from 'ecsy';

export class CPlayer extends Component {
  public color: string;
  public id: string;
  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.color = '';
    this.id = '';
  }

  copy(src: CPlayer) {
    this.color = src.color;
    this.id = src.id;
  }

  reset() {
    this.color = '#000000';
    this.id = '';
  }
}
