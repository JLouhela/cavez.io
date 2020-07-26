import { Component, Types } from 'ecsy';

export class CSocket extends Component<CSocket> {
  socketId: string;
}

CSocket.schema = {
  socketId: { type: Types.String, default: '' },
};
