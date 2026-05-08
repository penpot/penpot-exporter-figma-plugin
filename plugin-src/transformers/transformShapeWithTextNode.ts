import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';

import type { RectShape } from '@ui/lib/types/shapes/rectShape';

export const transformShapeWithTextNode = (
  node: ShapeWithTextNode
): Promise<RectShape | undefined> => transformNodeAsImageRect(node);
