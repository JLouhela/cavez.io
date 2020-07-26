import { Component, Types } from 'ecsy';

export class CCameraFollow extends Component<CCameraFollow> {
  cameraId: number;
}

CCameraFollow.schema = {
  cameraId: { type: Types.Number, default: -1 },
};
