import type { BoolShape } from '@ui/lib/types/shapes/boolShape';
import type { CircleShape } from '@ui/lib/types/shapes/circleShape';
import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';
import type { ComponentInstance, ComponentRoot } from '@ui/types';

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
