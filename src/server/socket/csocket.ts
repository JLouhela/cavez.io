import { Component } from 'ecsy';

export class CSocket extends Component {
  public socketId: string;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.socketId = '';
  }

  copy(src: CSocket) {
    this.socketId = src.socketId;
  }

  reset() {
    this.socketId = '';
  }
}
