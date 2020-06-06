import { System, Entity } from 'ecsy';
import { CPlayer } from '../../../shared/game/component/cplayer';

export class EntityDeleteSystem extends System {
  private eraseByPlayerName: string[] = [];

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.eraseByPlayerName = attributes.eraseByPlayerName;
  }

  execute(delta: number, time: number) {
    this.queries.players.results.forEach((entity) => {
      const name = entity.getComponent(CPlayer).name;
      if (this.eraseByPlayerName.includes(name)) {
        console.log(
          'Erased player ' + name + ' with id ' + entity.id + ' from  world'
        );
        entity.remove();
        this.eraseByPlayerName.splice(this.eraseByPlayerName.indexOf(name), 1);
      }
    });
  }
}

EntityDeleteSystem.queries = {
  players: {
    components: [CPlayer],
  },
};
