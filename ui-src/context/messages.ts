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

export const sendMessage = (pluginMessage: PluginMessage): void => {
  window.dispatchEvent(
    new MessageEvent<MessageData>('message', {
      data: {
        pluginMessage
      }
    })
  );
};
