export interface InputState {
  timeStamp: number;
  inputMask: number;
  id: number;
}

export class InputHistory {
  private inputs: InputState[] = [];

  constructor() {}

  public storeInput(inputMask: number, id: number) {
    this.inputs.push({ timeStamp: performance.now(), inputMask, id });
  }

  public removeUntil(id: number) {
    let removeCount = 0;
    for (let i = 0; i < this.inputs.length; ++i) {
      if (this.inputs[i].id == id) {
        removeCount = i;
        break;
      }
    }
    this.inputs.splice(0, removeCount);
  }

  public readInput(timeStamp: number) {
    for (let i = 1; i < this.inputs.length; ++i) {
      if (this.inputs[i].timeStamp > timeStamp) {
        if (this.inputs[i - 1].timeStamp <= timeStamp) {
          return this.inputs[i - 1].inputMask;
        }
        break;
      }
    }
    console.log('Active input on timestamp ' + timeStamp + ' not found');
    return 0x00;
  }
}
