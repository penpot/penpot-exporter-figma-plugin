import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';

import type { RectShape } from '@ui/lib/types/shapes/rectShape';

// TODO: Look for a better transform solution.
// Currently, rasterized as a image, as a provisional solution.
export const transformShapeWithTextNode = (
  node: ShapeWithTextNode
): Promise<RectShape | undefined> => transformNodeAsImageRect(node);
