import { PenpotDocument } from '@ui/types';

import { Steps } from '.';

export type MessageData = { pluginMessage?: PluginMessage };

type PluginMessage =
  | PenpotDocumentMessage
  | CustomFontsMessage
  | ChangesDetectedMessage
  | ProgressStepMessage
  | ProgressCurrentItemMessage
  | ProgressTotalItemsMessage
  | ProgressProcessedItemsMessage;

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

export const sendMessage = (pluginMessage: PluginMessage) => {
  window.dispatchEvent(
    new MessageEvent<MessageData>('message', {
      data: {
        pluginMessage
      }
    })
  );
};
