import { Component } from 'ecsy';

export class CCameraFollow extends Component {
  public cameraId: number;
  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.cameraId = -1;
  }

  copy(src: CCameraFollow) {
    this.cameraId = src.cameraId;
  }

  reset() {
    this.cameraId = -1;
  }
}
