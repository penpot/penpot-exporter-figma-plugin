import { CircleShape } from './circle/circleShape';
import { FrameShape } from './frame/frameShape';
import { GroupShape } from './group/groupShape';
import { ImageShape } from './image/imageShape';
import { RectShape } from './rect/rectShape';
import { TextShape } from './text/textShape';

export type PenpotNode = FrameShape | GroupShape | RectShape | CircleShape | TextShape | ImageShape;
