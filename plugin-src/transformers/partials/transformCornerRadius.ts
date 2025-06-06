import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

const isRectangleCornerMixin = (
  node: CornerMixin | (CornerMixin & RectangleCornerMixin)
): node is CornerMixin & RectangleCornerMixin => {
  return 'topLeftRadius' in node && node.cornerRadius === figma.mixed;
};

export const transformCornerRadius = (
  node: CornerMixin | (CornerMixin & RectangleCornerMixin)
):
  | Pick<ShapeAttributes, 'r1' | 'r2' | 'r3' | 'r4'>
  | Pick<ShapeAttributes, 'rx' | 'ry'>
  | undefined => {
  if (isRectangleCornerMixin(node)) {
    return {
      rx: Math.max(node.topLeftRadius, node.topRightRadius),
      ry: Math.max(node.topLeftRadius, node.topRightRadius),
      r1: node.topLeftRadius,
      r2: node.topRightRadius,
      r3: node.bottomRightRadius,
      r4: node.bottomLeftRadius
    };
  }

  if (node.cornerRadius !== figma.mixed) {
    return {
      rx: node.cornerRadius,
      ry: node.cornerRadius,
      r1: node.cornerRadius,
      r2: node.cornerRadius,
      r3: node.cornerRadius,
      r4: node.cornerRadius
    };
  }
};
