import { Uuid } from '../utils/uuid';

export type FrameAttributes = {
  id?: Uuid;
  type: symbol;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shapes?: any[];
  fileThumbnail?: boolean;
  hideFillOnExport?: boolean;
  showContent?: boolean;
  hideInViewer?: boolean;
};
