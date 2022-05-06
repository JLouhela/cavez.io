import {
  Component,
  Types,
} from 'ecsy';

export interface IPosition {
  x: number;
  y: number;
}

export class CPosition extends Component<CPosition> implements IPosition {
  declare x: number;
  declare y: number;
}

CPosition.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
};
