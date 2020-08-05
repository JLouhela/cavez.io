import {
  Component,
  Types,
  createType,
  copyCopyable,
  cloneClonable,
} from 'ecsy';

export class CPosition extends Component<CPosition> {
  x: number;
  y: number;
}

CPosition.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
};
