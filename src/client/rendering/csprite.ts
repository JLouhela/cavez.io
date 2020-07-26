import { Component, Types } from 'ecsy';

export class CSprite extends Component<CSprite> {
  spriteId: number;
  hue: number;
}

CSprite.schema = {
  spriteId: { type: Types.Number, default: -1 },
  hue: { type: Types.Number, default: 0xffffff },
};
