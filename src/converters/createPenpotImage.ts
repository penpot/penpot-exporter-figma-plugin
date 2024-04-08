import { NodeData } from '../interfaces';
import { PenpotFile } from '../penpot';

export const createPenpotImage = (
  file: PenpotFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.createImage({
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    metadata: {
      width: node.width,
      height: node.height
    },
    dataUri: node.imageFill
  });
};
