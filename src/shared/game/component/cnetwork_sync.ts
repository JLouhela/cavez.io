import { CPositionType, CPosition } from './cposition';
import { CPlayerType, CPlayer } from './cplayer';
import { CPhysicsType, CPhysics } from './cphysics';

import { Component, Types } from 'ecsy';

export class CNetworkSync extends Component<CNetworkSync> {
  pos: CPosition;
  player: CPlayer;
  physics: CPhysics;
  entityId: number;
}

CNetworkSync.schema = {
  pos: { type: CPositionType, default: null },
  player: { type: CPlayerType, default: null },
  physics: { type: CPhysicsType, default: null },
  entityId: { type: Types.Number, default: -1 },
};
