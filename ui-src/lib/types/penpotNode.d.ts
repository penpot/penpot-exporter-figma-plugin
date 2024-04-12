import { CircleShape } from '@ui/lib/types/circle/circleShape';
import { FrameShape } from '@ui/lib/types/frame/frameShape';
import { GroupShape } from '@ui/lib/types/group/groupShape';
import { ImageShape } from '@ui/lib/types/image/imageShape';
import { RectShape } from '@ui/lib/types/rect/rectShape';
import { TextShape } from '@ui/lib/types/text/textShape';

export type PenpotNode = FrameShape | GroupShape | RectShape | CircleShape | TextShape | ImageShape;
