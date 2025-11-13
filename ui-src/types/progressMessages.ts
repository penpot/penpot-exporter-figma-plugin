import type { PenpotDocument } from '@ui/types/penpotDocument';

export type Steps =
  | 'processing'
  | 'images'
  | 'optimization'
  | 'building'
  | 'components'
  | 'exporting'
  | 'fills'
  | 'colorLibraries'
  | 'typographies'
  | 'typoLibraries';

export type PenpotDocumentMessage = {
  type: 'PENPOT_DOCUMENT';
  data: PenpotDocument;
};

export type ProgressStepMessage = {
  type: 'PROGRESS_STEP';
  data: Steps;
};

export type ProgressTotalItemsMessage = {
  type: 'PROGRESS_TOTAL_ITEMS';
  data: number;
};

export type ProgressProcessedItemsMessage = {
  type: 'PROGRESS_PROCESSED_ITEMS';
  data: number;
};

export type ProgressCurrentItemMessage = {
  type: 'PROGRESS_CURRENT_ITEM';
  data: string;
};

export type ReloadMessage = {
  type: 'RELOAD';
};

export type ErrorMessage = {
  type: 'ERROR';
  data: string;
};

export type UserDataMessage = {
  type: 'USER_DATA';
  data: {
    userId: string;
  };
};

export type PluginMessage =
  | PenpotDocumentMessage
  | ProgressStepMessage
  | ProgressTotalItemsMessage
  | ProgressProcessedItemsMessage
  | ProgressCurrentItemMessage
  | ReloadMessage
  | ErrorMessage
  | UserDataMessage;

/**
 * Types that should be buffered (only the latest message of each type is kept)
 */
export const BUFFERED_PROGRESS_TYPES = ['PROGRESS_CURRENT_ITEM'] as const;

export type BufferedProgressType = (typeof BUFFERED_PROGRESS_TYPES)[number];
