import * as Protocol from '../../shared/protocol';

export class InputManager {
  private inputBuffer: { [id: string]: Protocol.IInputUpdateEvent[] } = {};

  public addInputUpdate(socketId: string, event: Protocol.IInputUpdateEvent) {
    if (!this.inputBuffer[socketId]) {
      this.inputBuffer[socketId] = [];
    }

    this.inputBuffer[socketId].push(event);
  }

  public getInputEvents(socketId: string) {
    return this.inputBuffer[socketId];
  }

  // Erase up to timestamp, keep equal
  public eraseInputsByTime(socketId: string, timestamp: number) {
    const inputList = this.inputBuffer[socketId];
    if (!inputList) {
      return;
    }
    let deleteIndex = -1;
    for (let i = 0; i < inputList.length; ++i) {
      if (inputList[i].timestamp < timestamp) {
        deleteIndex = i;
      } else {
        break;
      }
    }
    inputList.splice(0, deleteIndex);
  }

  public eraseInputs(socketId: string) {
    this.inputBuffer[socketId] = [];
  }
}
