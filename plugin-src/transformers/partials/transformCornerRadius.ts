import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

const isRectangleCornerMixin = (
  node: CornerMixin | (CornerMixin & RectangleCornerMixin)
): node is CornerMixin & RectangleCornerMixin => {
  return 'topLeftRadius' in node && node.cornerRadius === figma.mixed;
};

export const transformCornerRadius = (
  node: CornerMixin | (CornerMixin & RectangleCornerMixin)
): Partial<ShapeAttributes> | undefined => {
  if (isRectangleCornerMixin(node)) {
    return {
      r1: node.topLeftRadius,
      r2: node.topRightRadius,
      r3: node.bottomRightRadius,
      r4: node.bottomLeftRadius
    };
  }

  if (node.cornerRadius !== figma.mixed) {
    return {
      rx: node.cornerRadius
    };
  }
};
