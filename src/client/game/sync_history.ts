import { IEntityUpdate, IEntityUpdateEvent } from '../../shared/protocol';
import { negativeMod } from '../../shared/math/math_utils';
import * as Protocol from '../../shared/protocol';

export interface InterpolateState {
  previous: Protocol.IEntityUpdateEvent;
  next: Protocol.IEntityUpdateEvent;
}

export class SyncHistory {
  // Ring buffer similar to input history
  // No generic implementation to allow store by values without heap allocation
  private updates: IEntityUpdateEvent[] = null;
  private updateCount: number = 0;
  private firstIndex: number = 0;

  constructor(size: number) {
    this.updates = [];
    for (let i = 0; i < size; ++i) {
      this.updates.push({ timestamp: 0, entityUpdates: {} });
    }
  }

  private getLastIndex(): number {
    return negativeMod(
      this.updateCount + this.firstIndex - 1,
      this.updates.length
    );
  }

  public getLatest() {
    if (this.updates.length > 0) {
      return this.updates[this.getLastIndex()];
    }
    return null;
  }

  public getInterpolateState() {
    if (this.updates.length > 1) {
      return {
        previous: this.updates[
          negativeMod(this.getLastIndex() - 1, this.updates.length)
        ],
        next: this.updates[this.getLastIndex()],
      };
    }
    return null;
  }

  // TODO update triggers GC rendering ringbuffer sort of pointless here
  // Allocs need to be done anyway when events are received from socket,
  // but think if there's better solution. Still offers easy way to
  // discard oldest
  public storeSyncEvents(timestamp: number, update: IEntityUpdate) {
    const nextIndex = (this.getLastIndex() + 1) % this.updates.length;
    this.updates[nextIndex].timestamp = timestamp;
    this.updates[nextIndex].entityUpdates = update;

    // If buffer overflow, move first index
    if (this.updateCount === this.updates.length) {
      this.firstIndex = (this.firstIndex + 1) % this.updates.length;
    } else {
      this.updateCount++;
    }
  }

  public removeUntil(timestamp: number) {
    let removeCount = 0;
    for (let i = 0; i < this.updateCount; ++i) {
      if (
        this.updates[(i + this.firstIndex) % this.updates.length].timestamp >
        timestamp
      ) {
        break;
      }
      removeCount++;
    }
    // Keep at least two elements for interpolation
    removeCount = Math.min(2, removeCount);
    this.updateCount -= removeCount;
    this.firstIndex = (this.firstIndex + removeCount) % this.updates.length;
  }

  public getSyncEvent(timestamp: number) {
    // No updates or first element already larger than arg
    if (
      this.updateCount === 0 ||
      this.updates[this.firstIndex].timestamp > timestamp
    ) {
      return null;
    }
    // Single update stored: check if valid for the arg
    if (this.updateCount === 1) {
      return this.updates[this.firstIndex].timestamp <= timestamp
        ? this.updates[this.firstIndex]
        : null;
    }
    // More than one input stored: check if last one valid (no lookup needed)
    const lastIndex = this.getLastIndex();
    if (this.updates[lastIndex].timestamp <= timestamp) {
      return this.updates[lastIndex];
    }
    // More than one input stored: find valid one
    for (let i = 1; i < this.updateCount; ++i) {
      const index = (this.firstIndex + i) % this.updates.length;
      const prevIndex = negativeMod(index - 1, this.updates.length);
      // Earlier checks ensure that first index has timestamp smaller than arg
      if (this.updates[index].timestamp > timestamp) {
        return this.updates[prevIndex];
      }
    }
    console.log('Active sync events on timestamp ' + timestamp + ' not found');
    return null;
  }
}
