import { describe, expect, it } from 'vitest';

import { createInMemoryWritable } from '@ui/context/createInMemoryWritable';

const writeChunks = async (
  writable: WritableStream,
  chunks: Uint8Array<ArrayBuffer>[]
): Promise<void> => {
  const writer = writable.getWriter();

  for (const chunk of chunks) {
    await writer.write(chunk);
  }

  await writer.close();
};

describe('createInMemoryWritable', () => {
  it('produces a blob whose bytes match the concatenation of written chunks, in order', async () => {
    const { writable, getBlob } = createInMemoryWritable();

    const chunks = [
      new Uint8Array([1, 2, 3]),
      new Uint8Array([4, 5]),
      new Uint8Array([6, 7, 8, 9])
    ];

    await writeChunks(writable, chunks);

    const bytes = new Uint8Array(await getBlob().arrayBuffer());

    expect(Array.from(bytes)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('defaults the blob type to application/zip', async () => {
    const { writable, getBlob } = createInMemoryWritable();

    await writeChunks(writable, [new Uint8Array([0])]);

    expect(getBlob().type).toBe('application/zip');
  });

  it('honours a custom blob type', async () => {
    const { writable, getBlob } = createInMemoryWritable();

    await writeChunks(writable, [new Uint8Array([0])]);

    expect(getBlob('image/png').type).toBe('image/png');
  });

  it('produces an empty blob when nothing is written', () => {
    const { getBlob } = createInMemoryWritable();

    expect(getBlob().size).toBe(0);
  });
});
