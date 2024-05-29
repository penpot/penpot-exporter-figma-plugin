import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { ComponentInstance, ComponentRoot } from '@ui/types';

export type PenpotNode =
  | FrameShape
  | GroupShape
  | PathShape
  | RectShape
  | CircleShape
  | TextShape
  | BoolShape
  | ComponentInstance
  | ComponentRoot;
