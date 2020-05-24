import { Component } from 'ecsy';

export class CNetworkEntity extends Component {
  public serverId: number;
  public clientId: number;

  constructor() {
    super();
    this.reset();
  }

  clear() {
    this.serverId = -1;
    this.clientId = -1;
  }

  copy(src: CNetworkEntity) {
    this.serverId = src.serverId;
    this.clientId = src.clientId;
  }

  reset() {
    this.serverId = -1;
    this.clientId = -1;
  }
}
