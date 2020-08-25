export interface InputState {
  timeStamp: number;
  inputMask: number;
}

export class InputHistory {
  private inputs: InputState[] = [];

  constructor() {}

  public storeInput(inputMask: number) {
    this.inputs.push({ timeStamp: performance.now(), inputMask });
  }

  public removeUntil(timeStamp: number) {
    let removeCount = 0;
    for (let i = 0; i < this.inputs.length; ++i, ++removeCount) {
      if (this.inputs[i].timeStamp >= timeStamp) {
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
