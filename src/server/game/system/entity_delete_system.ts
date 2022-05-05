import { System, Entity, Attributes, World } from 'ecsy';
import { CPlayer } from '../../../shared/game/component/cplayer.js';

export class EntityDeleteSystem extends System {
  private eraseByPlayerName: string[] = [];

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.eraseByPlayerName = attributes.eraseByPlayerName as string[];
  }

  execute(_delta: number, _time: number) {
    this.queries.players.results.forEach((entity) => {
      const name = entity.getComponent(CPlayer).name;
      if (this.eraseByPlayerName.includes(name)) {
        entity.remove();
        this.eraseByPlayerName.splice(this.eraseByPlayerName.indexOf(name), 1);
        console.log(`Erased player ${name} with id ${entity.id} from world`);
      }
    });
  }
}

EntityDeleteSystem.queries = {
  players: {
    components: [CPlayer],
  },
};
