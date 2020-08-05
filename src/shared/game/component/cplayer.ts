import {
  Component,
  Types,
  createType,
  copyCopyable,
  cloneClonable,
} from 'ecsy';

export class CPlayer extends Component<CPlayer> {
  color: string;
  name: string;
}

CPlayer.schema = {
  color: { type: Types.String, default: '#000000' },
  name: { type: Types.String, default: 'unnamed' },
};
