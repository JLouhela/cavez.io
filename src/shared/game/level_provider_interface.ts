import { Level } from './level';

export interface ILevelProvider {
  getLevel(): Level;
}
