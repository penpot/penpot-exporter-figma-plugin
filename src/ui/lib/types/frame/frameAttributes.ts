import { Uuid } from '../utils/uuid';

export const FRAME_TYPE: unique symbol = Symbol.for('frame');

export type FrameAttributes = {
  type: 'frame' | typeof FRAME_TYPE;
  id?: Uuid;
  shapes?: Uuid[];
  fileThumbnail?: boolean;
  hideFillOnExport?: boolean;
  showContent?: boolean;
  hideInViewer?: boolean;
};
