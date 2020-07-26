import { Component, Types } from 'ecsy';

export class CThrottle extends Component<CThrottle> {
  throttlePower: number;
  throttleOn: boolean;
}

CThrottle.schema = {
  throttlePower: { type: Types.Number, default: 0.0 },
  throttleOn: { type: Types.Boolean, default: false },
};
