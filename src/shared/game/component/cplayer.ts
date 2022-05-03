import {
  Component,
  Types,
} from 'ecsy';

export class CPlayer extends Component<CPlayer> {
  declare color: string;
  declare name: string;
}

CPlayer.schema = {
  color: { type: Types.String, default: '#000000' },
  name: { type: Types.String, default: 'unnamed' },
};
