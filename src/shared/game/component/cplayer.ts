import {
  Component,
  Types,
} from 'ecsy';

export interface IPlayer {
  // TODO number instead of string -> transfers through network
  color: string;
  name: string;
}


export class CPlayer extends Component<CPlayer> implements IPlayer {
  declare color: string;
  declare name: string;
}

CPlayer.schema = {
  color: { type: Types.String, default: '#000000' },
  name: { type: Types.String, default: 'unnamed' },
};
