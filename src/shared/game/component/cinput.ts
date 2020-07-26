import { Component, Types } from 'ecsy';
import * as KeyCode from 'keycode-js';

export class CInput extends Component<CInput> {
  keyThrottle: number;
  keyRotCW: number;
  keyRotCCW: number;
}

CInput.schema = {
  keyThrottle: { type: Types.Number, default: KeyCode.KEY_UP },
  keyRotCW: { type: Types.Number, default: KeyCode.KEY_RIGHT },
  keyRotCCW: { type: Types.Number, default: KeyCode.KEY_LEFT },
};
