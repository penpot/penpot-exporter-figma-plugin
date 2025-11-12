import { createMessageBuffer } from '@common/messageBuffer';

import { BUFFERED_PROGRESS_TYPES, type PluginMessage } from '@ui/types/progressMessages';

const BUFFERED_TYPES = new Set(BUFFERED_PROGRESS_TYPES);

const messageBuffer = createMessageBuffer<PluginMessage>({
  bufferedTypes: BUFFERED_TYPES,
  flushInterval: 100,
  sendMessage: message => {
    figma.ui.postMessage(message);
  }
});

export const flushProgress = (): void => {
  messageBuffer.flush();
};

export const reportProgress = (message: PluginMessage): void => {
  messageBuffer.send(message);
};
