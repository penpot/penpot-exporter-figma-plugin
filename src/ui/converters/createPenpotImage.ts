import { ExportFile, NodeData } from '../../common/interfaces';

export const createPenpotImage = (
  file: ExportFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.penpotFile.createImage({
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
