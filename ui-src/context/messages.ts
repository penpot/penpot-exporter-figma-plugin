import { createMessageBuffer } from '@common/messageBuffer';

import { BUFFERED_PROGRESS_TYPES, type PluginMessage } from '@ui/types/progressMessages';

export type MessageData = { pluginMessage?: PluginMessage };

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
  flushInterval: 500,
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
