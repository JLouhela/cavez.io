export interface IInputReader {
  isKeyDown(keyCode: number): boolean;
}

export class InputReader implements IInputReader {
  private keysDown: Set<number>;

  constructor() {
    this.keysDown = new Set();
  }

  public isKeyDown(keyCode: number): boolean {
    return this.keysDown.has(keyCode);
  }

  // TODO KeyboardEvent deprecated
  public keyDownEventListener(event: KeyboardEvent) {
    this.keysDown.add(event.keyCode);
  }

  public keyUpEventListener(event: KeyboardEvent) {
    this.keysDown.delete(event.keyCode);
  }
}
