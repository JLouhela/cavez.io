import { negativeMod } from '../../shared/math/math_utils.js';

export interface InputState {
  timestamp: number;
  inputMask: number;
  id: number;
}

export class InputHistory {
  // Ring buffer similar to sync events
  // No generic implementation to allow store by values without heap allocation
  private inputs: InputState[] = null;
  private inputCount = 0;
  private firstIndex = 0;

  constructor(size: number) {
    this.inputs = [];
    for (let i = 0; i < size; ++i) {
      this.inputs.push({ timestamp: 0, inputMask: 0, id: 0 });
    }
  }

  private getLastIndex(): number {
    return negativeMod(
      this.inputCount + this.firstIndex - 1,
      this.inputs.length
    );
  }

  public storeInput(inputMask: number, id: number) {
    const nextIndex = (this.getLastIndex() + 1) % this.inputs.length;
    this.inputs[nextIndex].timestamp = performance.now();
    this.inputs[nextIndex].id = id;
    this.inputs[nextIndex].inputMask = inputMask;
    // If buffer overflow, move first index
    if (this.inputCount === this.inputs.length) {
      console.log('MOVE index');
      this.firstIndex = (this.firstIndex + 1) % this.inputs.length;
    } else {
      this.inputCount++;
    }
  }

  public removeUntil(id: number) {
    let removeCount = 0;
    for (let i = 0; i < this.inputCount; ++i) {
      if (this.inputs[(i + this.firstIndex) % this.inputs.length].id === id) {
        break;
      }
      removeCount++;
    }
    this.inputCount -= removeCount;
    this.firstIndex = (this.firstIndex + removeCount) % this.inputs.length;
  }

  public readInput(timestamp: number) {
    // No inputs or first element already larger than arg
    if (
      this.inputCount === 0 ||
      this.inputs[this.firstIndex].timestamp > timestamp
    ) {
      return 0x00;
    }
    // Single input stored: check if valid for the arg
    if (this.inputCount === 1) {
      return this.inputs[this.firstIndex].timestamp <= timestamp
        ? this.inputs[this.firstIndex].inputMask
        : 0x00;
    }
    // More than one input stored: check if last one valid (no lookup needed)
    const lastIndex = this.getLastIndex();
    if (this.inputs[lastIndex].timestamp <= timestamp) {
      return this.inputs[lastIndex].inputMask;
    }
    // More than one input stored: find valid one
    for (let i = 1; i < this.inputCount; ++i) {
      const index = (this.firstIndex + i) % this.inputs.length;
      const prevIndex = negativeMod(index - 1, this.inputs.length);
      // Earlier checks ensure that first index has timestamp smaller than arg
      if (this.inputs[index].timestamp > timestamp) {
        return this.inputs[prevIndex].inputMask;
      }
    }
    console.log(`Active input on timestamp ${timestamp} not found`);
    return 0x00;
  }

  public getInputById(id: number) {
    return this.inputs.find((i) => i.id === id);
  }
}
