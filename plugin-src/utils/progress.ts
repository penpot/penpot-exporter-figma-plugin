import { createMessageBuffer } from '@common/messageBuffer';

import { BUFFERED_PROGRESS_TYPES, type PluginMessage, type Steps } from '@ui/types';

const BUFFERED_TYPES = new Set(BUFFERED_PROGRESS_TYPES);

let lastSentCurrentItem: string | undefined;
let currentStep: Steps | undefined;
let currentItem: string | undefined;

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
  currentStep = undefined;
  currentItem = undefined;
};

export const reportProgress = (message: PluginMessage): void => {
  if (message.type === 'PROGRESS_STEP') {
    currentStep = message.data.step;
  }

  if (message.type === 'PROGRESS_CURRENT_ITEM') {
    if (message.data === lastSentCurrentItem) {
      return;
    }
    currentItem = message.data;
  }

  messageBuffer.send(message);
};

export const getCurrentStep = (): Steps | undefined => currentStep;
export const getCurrentItem = (): string | undefined => currentItem;
