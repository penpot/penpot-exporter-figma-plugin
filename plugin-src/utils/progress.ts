import { createMessageBuffer } from '@common/messageBuffer';

import { BUFFERED_PROGRESS_TYPES, type PluginMessage } from '@ui/types';

const BUFFERED_TYPES = new Set(BUFFERED_PROGRESS_TYPES);

let lastSentCurrentItem: string | undefined;

const messageBuffer = createMessageBuffer<PluginMessage>({
  bufferedTypes: BUFFERED_TYPES,
  flushInterval: 500,
  sendMessage: message => {
    if (message.type === 'PROGRESS_CURRENT_ITEM') {
      lastSentCurrentItem = message.data;
    }
    figma.ui.postMessage(message);
  }
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
