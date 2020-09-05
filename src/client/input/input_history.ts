export interface InputState {
  timestamp: number;
  inputMask: number;
  id: number;
}

export class InputHistory {
  private inputs: InputState[] = [];

  constructor() {}

  public storeInput(inputMask: number, id: number) {
    this.inputs.push({ timestamp: performance.now(), inputMask, id });
  }

  public removeUntil(id: number) {
    let removeCount = 0;
    for (let i = 0; i < this.inputs.length; ++i) {
      if (this.inputs[i].id === id) {
        removeCount = i;
        break;
      }
    }
    // TODO reuse and avoid garbage collection
    this.inputs.splice(0, removeCount);
  }

  public readInput(timestamp: number) {
    for (let i = 1; i < this.inputs.length; ++i) {
      if (this.inputs[i].timestamp > timestamp) {
        if (this.inputs[i - 1].timestamp <= timestamp) {
          return this.inputs[i - 1].inputMask;
        }
        break;
      }
    }
    console.log('Active input on timestamp ' + timestamp + ' not found');
    return 0x00;
  }

  public getInputById(id: number) {
    return this.inputs.find((i) => i.id === id);
  }
}
