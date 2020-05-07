import { Renderer } from 'pixi.js';

export class GameRenderer {
  private canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  private context = this.canvas.getContext('2d');

  init() {
    // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
    // 800 in-game units of width.
    const scaleRatio = Math.max(1, 800 / window.innerWidth);
    this.canvas.width = scaleRatio * window.innerWidth;
    this.canvas.height = scaleRatio * window.innerHeight;
  }
}
