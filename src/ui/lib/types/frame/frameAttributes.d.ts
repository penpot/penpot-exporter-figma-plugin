import { Uuid } from '../utils/uuid';

export type FrameAttributes = {
  id?: Uuid;
  type: symbol;
  shapes?: Uuid[];
  fileThumbnail?: boolean;
  hideFillOnExport?: boolean;
  showContent?: boolean;
  hideInViewer?: boolean;
};
