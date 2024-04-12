import { Shape } from '../shape';
import { Children } from '../utils/children';
import { FrameAttributes } from './frameAttributes';

export type FrameShape = Shape & FrameAttributes & Children;
