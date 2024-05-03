import { Stroke } from '@ui/lib/types/utils/stroke';
import { Uuid } from '@ui/lib/types/utils/uuid';

import { Fill } from '../utils/fill';

export type FrameAttributes = {
  type?: 'frame';
  shapes?: Uuid[];
  hideFillOnExport?: boolean;
  showContent?: boolean;
  hideInViewer?: boolean;
  fills?: Fill[];
  strokes?: Stroke[];
};
