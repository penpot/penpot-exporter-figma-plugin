import { transformDimensionAndPosition } from '@plugin/transformers/partials';
import { detectMimeType } from '@plugin/utils';

import { ImageShape } from '@ui/lib/types/image/imageShape';

export const transformImageNode = async (
  node: SceneNode,
  baseX: number,
  baseY: number
): Promise<ImageShape> => {
  let dataUri = '';
  if ('exportAsync' in node) {
    const value = await node.exportAsync({ format: 'PNG' });
    const b64 = figma.base64Encode(value);
    dataUri = 'data:' + detectMimeType(b64) + ';base64,' + b64;
  }

  return {
    type: 'image',
    name: node.name,
    metadata: {
      width: node.width,
      height: node.height
    },
    dataUri: dataUri,
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
