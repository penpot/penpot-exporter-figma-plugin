import { analyzeEditableShapeWithTextSvg } from '@plugin/translators/shapeWithText/analyzeEditableShapeWithTextSvg';

export type ShapeWithTextGeometry = {
  content: string;
  svgOrigin: { x: number; y: number };
};

export const translateShapeWithTextGeometry = (
  node: ShapeWithTextNode,
  svg: string,
  aabb: Rect
): ShapeWithTextGeometry | undefined => {
  const analysis = analyzeEditableShapeWithTextSvg(node, svg, aabb);
  if (!analysis) return;

  return {
    content: analysis.content,
    svgOrigin: analysis.svgOrigin
  };
};
