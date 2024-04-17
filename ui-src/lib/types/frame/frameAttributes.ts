import { Uuid } from '@ui/lib/types/utils/uuid';

import { Fill } from '../utils/fill';

export const FRAME_TYPE: unique symbol = Symbol.for('frame');

export type FrameAttributes = {
  type: 'frame' | typeof FRAME_TYPE;
  shapes?: Uuid[];
  fileThumbnail?: boolean;
  hideFillOnExport?: boolean;
  showContent?: boolean;
  hideInViewer?: boolean;
  fills?: Fill[];
};
