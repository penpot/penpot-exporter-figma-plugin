import { Shape } from '@ui/lib/types/shape';
import { Children } from '@ui/lib/types/utils/children';

import { FrameAttributes } from './frameAttributes';

export type FrameShape = Shape & FrameAttributes & Children;
