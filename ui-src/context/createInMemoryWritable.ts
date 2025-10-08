export const createInMemoryWritable = (): {
  writable: WritableStream;
  getBlob: (type?: string) => Blob;
} => {
  const chunks: Uint8Array<ArrayBuffer>[] = [];

  const writable = new WritableStream({
    write(chunk: Uint8Array<ArrayBuffer>): void {
      chunks.push(chunk);
    },
    close(): void {},
    abort(err: Error): void {
      console.error('Writable aborted:', err);
    }
  });

  return {
    writable,
    getBlob: (type = 'application/zip') => new Blob(chunks, { type })
  };
};
