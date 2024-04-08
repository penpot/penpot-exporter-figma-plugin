import {
  createPenpotBoard,
  createPenpotCircle,
  createPenpotGroup,
  createPenpotImage,
  createPenpotPage,
  createPenpotRectangle,
  createPenpotText
} from '.';
import { NodeData, TextData } from '../../common/interfaces';
import { PenpotFile } from '../penpot';
import { calculateAdjustment } from '../utils';

export const createPenpotItem = (
  file: PenpotFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  // We special-case images because an image in figma is a shape with one or many
  // image fills.  Given that handling images in Penpot is a bit different, we
  // rasterize a figma shape with any image fills to a PNG and then add it as a single
  // Penpot image.  Implication is that any node that has an image fill will only be
  // treated as an image, so we skip node type checks.
  const hasImageFill = node.fills?.some((fill: Paint) => fill.type === 'IMAGE');
  if (hasImageFill) {
    // If the nested frames extended the bounds of the rasterized image, we need to
    // account for this both in position on the canvas and the calculated width and
    // height of the image.
    const [adjustedX, adjustedY] = calculateAdjustment(node);

    createPenpotImage(file, node, baseX + adjustedX, baseY + adjustedY);
  } else if (node.type == 'PAGE') {
    createPenpotPage(file, node);
  } else if (node.type == 'FRAME') {
    createPenpotBoard(file, node, baseX, baseY);
  } else if (node.type == 'GROUP') {
    createPenpotGroup(file, node, baseX, baseY);
  } else if (node.type == 'RECTANGLE') {
    createPenpotRectangle(file, node, baseX, baseY);
  } else if (node.type == 'ELLIPSE') {
    createPenpotCircle(file, node, baseX, baseY);
  } else if (node.type == 'TEXT') {
    createPenpotText(file, node as unknown as TextData, baseX, baseY);
  }
};
