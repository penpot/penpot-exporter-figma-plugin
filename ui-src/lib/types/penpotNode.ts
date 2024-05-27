import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { TextShape } from '@ui/lib/types/shapes/textShape';

export type PenpotNode =
  | FrameShape
  | GroupShape
  | PathShape
  | RectShape
  | CircleShape
  | TextShape
  | BoolShape
  | ComponentShape;
