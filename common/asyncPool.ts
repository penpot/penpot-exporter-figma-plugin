// Runs `worker` over every item with at most `concurrency` workers in flight at
// once. Workers share a single iterator, so each one pulls the next item as soon
// as it finishes the previous one. Resolves when every item has been processed.
export const asyncPool = async <T>(
  concurrency: number,
  items: Iterable<T>,
  worker: (item: T) => Promise<void>
): Promise<void> => {
  const iterator = items[Symbol.iterator]();

  const drain = async (): Promise<void> => {
    for (let next = iterator.next(); !next.done; next = iterator.next()) {
      await worker(next.value);
    }
  };

  const workers = Array.from({ length: Math.max(1, concurrency) }, drain);

  await Promise.all(workers);
};
