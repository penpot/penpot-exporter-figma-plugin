import { transformCornerRadius, transformStrokes } from '@plugin/transformers/partials';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

const isComponentSetDefaultStyle = (node: ComponentSetNode): boolean => {
  return (
    node.cornerRadius === 5 &&
    node.strokeAlign === 'INSIDE' &&
    node.dashPattern.length === 2 &&
    node.dashPattern[0] === 10 &&
    node.dashPattern[1] === 5 &&
    node.strokeWeight === 1 &&
    node.strokes.length === 1 &&
    node.strokes[0].blendMode === 'NORMAL' &&
    node.strokes[0].opacity === 1 &&
    node.strokes[0].type === 'SOLID' &&
    node.strokes[0].color.r === 0.5921568870544434 &&
    node.strokes[0].color.g === 0.27843138575553894 &&
    node.strokes[0].color.b === 1
  );
};

const transformPenpotDefaultStrokesAndCornerRadius = (): Pick<
  ShapeAttributes,
  'strokes' | 'r1' | 'r2' | 'r3' | 'r4'
> => {
  return {
    strokes: [
      {
        strokeWidth: 2,
        strokeAlignment: 'inner',
        strokeColor: '#bb97d8',
        strokeOpacity: 1,
        strokeStyle: 'solid'
      }
    ],
    r1: 20,
    r2: 20,
    r3: 20,
    r4: 20
  };
};

export const transformComponentSetStrokesAndCornerRadius = (
  node: ComponentSetNode
): Pick<ShapeAttributes, 'strokes' | 'r1' | 'r2' | 'r3' | 'r4'> => {
  if (isComponentSetDefaultStyle(node)) {
    return transformPenpotDefaultStrokesAndCornerRadius();
  }

  return {
    ...transformStrokes(node),
    ...transformCornerRadius(node)
  };
};
