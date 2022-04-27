import { Level } from './level.js';

export interface ILevelProvider {
  getLevel(): Level;
}
