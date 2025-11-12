import { createMessageBuffer } from '@common/messageBuffer';

import { BUFFERED_PROGRESS_TYPES, type BaseProgressMessage } from '@ui/types/progressMessages';

type ProgressStepMessage = {
  type: 'PROGRESS_STEP';
  data: string;
};

export type ProgressMessage = ProgressStepMessage | BaseProgressMessage;

const BUFFERED_TYPES = new Set(BUFFERED_PROGRESS_TYPES);

const messageBuffer = createMessageBuffer<ProgressMessage>({
  bufferedTypes: BUFFERED_TYPES as Set<ProgressMessage['type']>,
  flushInterval: 100,
  sendMessage: message => {
    figma.ui.postMessage(message);
  }
});

export const flushProgress = (): void => {
  messageBuffer.flush();
};

export const reportProgress = (message: ProgressMessage): void => {
  messageBuffer.send(message);
};
