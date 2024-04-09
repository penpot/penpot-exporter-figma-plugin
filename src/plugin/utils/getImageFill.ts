import { NodeData } from '../../common/interfaces';
import { detectMimeType } from './detectMimeType';

export async function getImageFill(baseNode: BaseNode, node: NodeData): Promise<string> {
  // Find any fill of type image
  const imageFill = node.fills.find(fill => fill.type === 'IMAGE');
  if (imageFill && 'exportAsync' in baseNode) {
    // An "image" in Figma is a shape with one or more image fills, potentially blended with other fill
    // types.  Given the complexity of mirroring this exactly in Penpot, which treats images as first-class
    // objects, we're going to simplify this by exporting this shape as a PNG image.
    const value = await baseNode.exportAsync({ format: 'PNG' });
    const b64 = figma.base64Encode(value);

    return 'data:' + detectMimeType(b64) + ';base64,' + b64;
  }

  return '';
}
