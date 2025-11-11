import type { Steps } from '@ui/context';
import type { PenpotDocument } from '@ui/types';

export type MessageData = { pluginMessage?: PluginMessage };

type PluginMessage =
  | PenpotDocumentMessage
  | CustomFontsMessage
  | ChangesDetectedMessage
  | ProgressStepMessage
  | ProgressCurrentItemMessage
  | ProgressTotalItemsMessage
  | ProgressProcessedItemsMessage
  | ReloadMessage
  | ErrorMessage
  | UserDataMessage;

type PenpotDocumentMessage = {
  type: 'PENPOT_DOCUMENT';
  data: PenpotDocument;
};

type CustomFontsMessage = {
  type: 'CUSTOM_FONTS';
  data: string[];
};

type ChangesDetectedMessage = {
  type: 'CHANGES_DETECTED';
};

type ProgressStepMessage = {
  type: 'PROGRESS_STEP';
  data: Steps;
};

type ProgressCurrentItemMessage = {
  type: 'PROGRESS_CURRENT_ITEM';
  data: string;
};

type ProgressTotalItemsMessage = {
  type: 'PROGRESS_TOTAL_ITEMS';
  data: number;
};

type ProgressProcessedItemsMessage = {
  type: 'PROGRESS_PROCESSED_ITEMS';
  data: number;
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

type BufferedPluginMessageType =
  | ProgressCurrentItemMessage['type']
  | ProgressProcessedItemsMessage['type']
  | ProgressTotalItemsMessage['type'];

const BUFFERED_TYPES: Set<BufferedPluginMessageType> = new Set([
  'PROGRESS_CURRENT_ITEM',
  'PROGRESS_PROCESSED_ITEMS',
  'PROGRESS_TOTAL_ITEMS'
]);

const bufferedMessages = new Map<BufferedPluginMessageType, PluginMessage>();

const FLUSH_INTERVAL = 100;

let flushHandle: number | undefined;

const emitMessage = (pluginMessage: PluginMessage): void => {
  window.dispatchEvent(
    new MessageEvent<MessageData>('message', {
      data: {
        pluginMessage
      }
    })
  );
};

const scheduleFlush = (): void => {
  if (flushHandle !== undefined) {
    return;
  }

  flushHandle = window.setTimeout(() => {
    flushHandle = undefined;
    flushBufferedMessages();
  }, FLUSH_INTERVAL);
};

const flushBufferedMessages = (): void => {
  if (flushHandle !== undefined) {
    window.clearTimeout(flushHandle);
    flushHandle = undefined;
  }

  if (bufferedMessages.size === 0) {
    return;
  }

  for (const message of bufferedMessages.values()) {
    emitMessage(message);
  }

  bufferedMessages.clear();
};

export const sendMessage = (pluginMessage: PluginMessage): void => {
  if (BUFFERED_TYPES.has(pluginMessage.type as BufferedPluginMessageType)) {
    bufferedMessages.set(pluginMessage.type as BufferedPluginMessageType, pluginMessage);
    scheduleFlush();

    return;
  }

  flushBufferedMessages();
  emitMessage(pluginMessage);
};

export const flushMessageQueue = (): void => {
  flushBufferedMessages();
};
