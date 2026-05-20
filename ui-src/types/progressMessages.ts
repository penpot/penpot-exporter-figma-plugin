import type { PenpotDocument } from '@ui/types';

import type { ErrorPayload } from './errorPayload';

export type ExportScope = 'all' | 'current';

export type Steps =
  | 'processing'
  | 'processAssets'
  | 'buildAssets'
  | 'building'
  | 'components'
  | 'exporting';

export const PROGRESS_STEPS: Steps[] = [
  'processing',
  'processAssets',
  'buildAssets',
  'building',
  'components',
  'exporting'
];

export type PenpotDocumentMessage = {
  type: 'PENPOT_DOCUMENT';
  data: PenpotDocument;
};

export type ProgressStepMessage = {
  type: 'PROGRESS_STEP';
  data: {
    step: Steps;
    total: number;
    label?: string;
    name?: string;
  };
};

export type ProgressProcessedItemsMessage = {
  type: 'PROGRESS_PROCESSED_ITEMS';
  data: number;
};

export type ProgressCurrentItemMessage = {
  type: 'PROGRESS_CURRENT_ITEM';
  data: string;
};

export type ProgressExportMessage = {
  type: 'PROGRESS_EXPORT';
  data: {
    current: number;
    total: number;
  };
};

export type ReloadMessage = {
  type: 'RELOAD';
};

export type ErrorMessage = {
  type: 'ERROR';
  data: ErrorPayload;
};

export type UserDataMessage = {
  type: 'USER_DATA';
  data: {
    userId: string;
  };
};

export type ExternalLibrariesMessage = {
  type: 'EXTERNAL_LIBRARIES';
  data: string[];
};

export type EditorTypeMessage = {
  type: 'EDITOR_TYPE';
  data: 'figma' | 'slides' | 'figjam' | 'dev' | 'buzz';
};

export type PluginMessage =
  | PenpotDocumentMessage
  | ProgressStepMessage
  | ProgressProcessedItemsMessage
  | ProgressCurrentItemMessage
  | ProgressExportMessage
  | ReloadMessage
  | ErrorMessage
  | UserDataMessage
  | ExternalLibrariesMessage
  | EditorTypeMessage;

/**
 * Types that should be buffered (only the latest message of each type is kept)
 */
export const BUFFERED_PROGRESS_TYPES = [
  'PROGRESS_PROCESSED_ITEMS',
  'PROGRESS_CURRENT_ITEM',
  'PROGRESS_EXPORT'
] as const;

export type BufferedProgressType = (typeof BUFFERED_PROGRESS_TYPES)[number];
