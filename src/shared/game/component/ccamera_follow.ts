import { Component } from 'ecsy';

export class CCameraFollow extends Component {
  public followEntityId: number;
  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.followEntityId = -1;
  }

  copy(src: CCameraFollow) {
    this.followEntityId = src.followEntityId;
  }

  reset() {
    this.followEntityId = -1;
  }
}
