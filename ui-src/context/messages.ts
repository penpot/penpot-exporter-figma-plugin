import { createMessageBuffer } from '@common/messageBuffer';

import type { Steps } from '@ui/context';
import type { PenpotDocument } from '@ui/types';
import { BUFFERED_PROGRESS_TYPES, type BaseProgressMessage } from '@ui/types/progressMessages';

export type MessageData = { pluginMessage?: PluginMessage };

type PenpotDocumentMessage = {
  type: 'PENPOT_DOCUMENT';
  data: PenpotDocument;
};

type ProgressStepMessage = {
  type: 'PROGRESS_STEP';
  data: Steps;
};

type ReloadMessage = {
  type: 'RELOAD';
};

type ErrorMessage = {
  type: 'ERROR';
  data: string;
};

type UserDataMessage = {
  type: 'USER_DATA';
  data: {
    userId: string;
  };
};

type PluginMessage =
  | BaseProgressMessage
  | PenpotDocumentMessage
  | ProgressStepMessage
  | ReloadMessage
  | ErrorMessage
  | UserDataMessage;

const BUFFERED_TYPES = new Set(BUFFERED_PROGRESS_TYPES);

const emitMessage = (pluginMessage: PluginMessage): void => {
  window.dispatchEvent(
    new MessageEvent<MessageData>('message', {
      data: {
        pluginMessage
      }
    })
  );
};

const messageBuffer = createMessageBuffer<PluginMessage>({
  bufferedTypes: BUFFERED_TYPES as Set<PluginMessage['type']>,
  flushInterval: 100,
  sendMessage: emitMessage,
  setTimeout: window.setTimeout.bind(window),
  clearTimeout: window.clearTimeout.bind(window)
});

export const sendMessage = (pluginMessage: PluginMessage): void => {
  messageBuffer.send(pluginMessage);
};

export const flushMessageQueue = (): void => {
  messageBuffer.flush();
};
