import { Component, Types } from 'ecsy';
import * as KeyCode from 'keycode-js';

export class CInput extends Component<CInput> {
  declare keyThrottle: number;
  declare keyRotCW: number;
  declare keyRotCCW: number;
}

CInput.schema = {
  keyThrottle: { type: Types.Number, default: KeyCode.KEY_UP },
  keyRotCW: { type: Types.Number, default: KeyCode.KEY_RIGHT },
  keyRotCCW: { type: Types.Number, default: KeyCode.KEY_LEFT },
};
