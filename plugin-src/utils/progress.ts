import { createMessageBuffer } from '@common/messageBuffer';

import { BUFFERED_PROGRESS_TYPES, type PluginMessage } from '@ui/types';

const BUFFERED_TYPES = new Set(BUFFERED_PROGRESS_TYPES);
const BATCH_SIZE_BYTES = 50 * 1024 * 1024; // 50MB per batch

let lastSentCurrentItem: string | undefined;

const sendImageBatches = (images: Record<string, Uint8Array<ArrayBuffer>>): void => {
  const imageEntries = Object.entries(images);

  if (imageEntries.length === 0) return;

  // Split images into batches based on size
  const batches: [string, Uint8Array<ArrayBuffer>][][] = [];
  let currentBatch: [string, Uint8Array<ArrayBuffer>][] = [];
  let currentBatchSize = 0;

  for (const entry of imageEntries) {
    const [, uint8Array] = entry;
    const imageSize = uint8Array.byteLength;

    if (currentBatchSize + imageSize > BATCH_SIZE_BYTES && currentBatch.length > 0) {
      batches.push(currentBatch);
      currentBatch = [];
      currentBatchSize = 0;
    }

    currentBatch.push(entry);
    currentBatchSize += imageSize;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  // Send each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchImages: Record<string, Uint8Array<ArrayBuffer>> = {};

    for (const [key, value] of batch) {
      batchImages[key] = value;
    }

    const transferables = batch.map(([, uint8Array]) => uint8Array.buffer);

    figma.ui.postMessage(
      {
        type: 'IMAGE_BATCH',
        data: {
          images: batchImages,
          currentBatch: i + 1,
          totalBatches: batches.length
        }
      },
      { transfer: transferables }
    );
  }
};

const calculateBatchCount = (images: Record<string, Uint8Array<ArrayBuffer>>): number => {
  const imageEntries = Object.entries(images);
  if (imageEntries.length === 0) return 0;

  let batchCount = 0;
  let currentBatchSize = 0;

  for (const [, uint8Array] of imageEntries) {
    const imageSize = uint8Array.byteLength;

    if (currentBatchSize + imageSize > BATCH_SIZE_BYTES && currentBatchSize > 0) {
      batchCount++;
      currentBatchSize = 0;
    }

    currentBatchSize += imageSize;
  }

  if (currentBatchSize > 0) {
    batchCount++;
  }

  return batchCount;
};

const sendPluginMessage = (message: PluginMessage): void => {
  if (message.type === 'PROGRESS_CURRENT_ITEM') {
    lastSentCurrentItem = message.data;
  }

  if (message.type === 'PENPOT_DOCUMENT') {
    const { images, ...documentWithoutImages } = message.data;
    const pendingImageBatches = calculateBatchCount(images);

    // Send document without images first, indicating how many batches to expect
    figma.ui.postMessage({
      type: 'PENPOT_DOCUMENT',
      data: { ...documentWithoutImages, images: {}, pendingImageBatches }
    });

    // Then send images in batches
    if (images && Object.keys(images).length > 0) {
      sendImageBatches(images);
    }
  } else {
    figma.ui.postMessage(message);
  }
};

const messageBuffer = createMessageBuffer<PluginMessage>({
  bufferedTypes: BUFFERED_TYPES,
  flushInterval: 500,
  sendMessage: sendPluginMessage
});

export const flushProgress = (): void => {
  messageBuffer.flush();
};

export const resetProgress = (): void => {
  lastSentCurrentItem = undefined;
};

export const reportProgress = (message: PluginMessage): void => {
  // Skip sending PROGRESS_CURRENT_ITEM if it's the same as the last sent value
  if (message.type === 'PROGRESS_CURRENT_ITEM' && message.data === lastSentCurrentItem) {
    return;
  }

  messageBuffer.send(message);
};
