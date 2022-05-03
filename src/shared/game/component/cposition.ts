import {
  Component,
  Types,
} from 'ecsy';

export class CPosition extends Component<CPosition> {
  declare x: number;
  declare y: number;
}

CPosition.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
};
