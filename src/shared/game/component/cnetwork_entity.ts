import { Component, Types } from 'ecsy';

export class CNetworkEntity extends Component<CNetworkEntity> {
  serverId: number;
  clientId: number;
}

CNetworkEntity.schema = {
  serverId: { type: Types.Number, default: -1 },
  clientId: { type: Types.Number, default: -1 },
};
