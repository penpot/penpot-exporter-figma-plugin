import * as fastq from 'fastq';
import type { queueAsPromised } from 'fastq';

import { transformSceneNode } from '@plugin/transformers';

import { PenpotNode } from '@ui/types';

class Queue<T, R> {
  private queue: queueAsPromised<T, R>;

  constructor(worker: fastq.asyncWorker<unknown, T, R>, concurrency: number) {
    this.queue = fastq.promise(worker, concurrency);
  }

  public enqueue(task: T): Promise<R> {
    return this.queue.push(task);
  }

  public async waitIdle() {
    await this.queue.drain();
  }
}

export const nodeQueue = new Queue(
  async ([sceneNode, position]: [SceneNode, number]): Promise<[PenpotNode | undefined, number]> => [
    await transformSceneNode(sceneNode),
    position
  ],
  1
);
