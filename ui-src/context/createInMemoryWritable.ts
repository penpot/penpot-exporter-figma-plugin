export const createInMemoryWritable = (): {
  writable: WritableStream;
  getBlob: (type?: string) => Blob;
} => {
  const chunks: Blob[] = [];

  const writable = new WritableStream({
    write(chunk: Uint8Array<ArrayBuffer>): void {
      // Wrap each chunk in a Blob: Chromium stores Blob payloads off the JS heap
      // (paging to disk under memory pressure), and the Blob constructor snapshots
      // the bytes so the original Uint8Array/ArrayBuffer becomes GC-able immediately.
      chunks.push(new Blob([chunk]));
    },
    close(): void {},
    abort(err: Error): void {
      console.error('Writable aborted', err);
    }
  });

  return {
    writable,
    getBlob: (type = 'application/zip') => new Blob(chunks, { type })
  };
};
