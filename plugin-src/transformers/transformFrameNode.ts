import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformGrids,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { Point } from '@ui/lib/types/utils/point';

const isSectionNode = (node: FrameNode | SectionNode | ComponentSetNode): node is SectionNode => {
  return node.type === 'SECTION';
};

export const transformFrameNode = async (node: FrameNode | SectionNode): Promise<FrameShape> => {
  // #region agent log
  const childrenCount = node.children?.length ?? 0;
  console.log('[DEBUG H4-frames] Processing frame node', JSON.stringify({nodeName:node.name,nodeType:node.type,childrenCount}));
  // #endregion

  let frameSpecificAttributes: Partial<FrameShape> = {};
  let referencePoint: Point = { x: node.absoluteTransform[0][2], y: node.absoluteTransform[1][2] };

  if (!isSectionNode(node)) {
    const { x, y, ...transformAndRotation } = transformRotationAndPosition(node);

    referencePoint = { x, y };

    // #region agent log
    console.log('[DEBUG H6-frameAttrs] Building frameSpecificAttributes', JSON.stringify({nodeName:node.name}));
    // #endregion

    // Figma API does not expose strokes, blend modes, corner radius, or constraint proportions for sections,
    // they plan to add it in the future. Refactor this when available.
    frameSpecificAttributes = {
      // @see: https://forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658
      ...transformStrokes(node),
      // @see: https://forum.figma.com/t/add-a-blendmode-property-for-sectionnode/58560
      ...transformBlend(node),
      ...transformProportion(node),
      ...transformLayoutAttributes(node, true),
      ...transformCornerRadius(node),
      ...transformEffects(node),
      ...transformConstraints(node),
      ...transformAutoLayout(node),
      ...transformGrids(node),
      ...transformAndRotation
    };

    // #region agent log
    console.log('[DEBUG H6-frameAttrs] frameSpecificAttributes complete', JSON.stringify({nodeName:node.name}));
    // #endregion
  }

  // #region agent log
  console.log('[DEBUG H7-frameReturn] Building return object', JSON.stringify({nodeName:node.name}));
  // #endregion

  // #region agent log
  const idsResult = transformIds(node);
  console.log('[DEBUG H7-frameReturn] transformIds done', JSON.stringify({nodeName:node.name}));
  const fillsResult = transformFills(node);
  console.log('[DEBUG H7-frameReturn] transformFills done', JSON.stringify({nodeName:node.name}));
  const dimensionResult = transformDimension(node);
  console.log('[DEBUG H7-frameReturn] transformDimension done', JSON.stringify({nodeName:node.name}));
  const sceneNodeResult = transformSceneNode(node);
  console.log('[DEBUG H7-frameReturn] transformSceneNode done', JSON.stringify({nodeName:node.name}));
  const variableConsumptionMapResult = transformVariableConsumptionMap(node);
  console.log('[DEBUG H7-frameReturn] transformVariableConsumptionMap done', JSON.stringify({nodeName:node.name}));
  console.log('[DEBUG H7-frameReturn] About to call transformChildren', JSON.stringify({nodeName:node.name,childrenCount}));
  const childrenResult = await transformChildren(node);
  console.log('[DEBUG H7-frameReturn] transformChildren done', JSON.stringify({nodeName:node.name,childrenResultKeys:Object.keys(childrenResult)}));
  const overridesResult = transformOverrides(node);
  console.log('[DEBUG H7-frameReturn] transformOverrides done', JSON.stringify({nodeName:node.name}));
  // #endregion

  return {
    type: 'frame',
    name: node.name,
    showContent: isSectionNode(node) ? true : !node.clipsContent,
    ...idsResult,
    ...fillsResult,
    ...referencePoint,
    ...frameSpecificAttributes,
    ...dimensionResult,
    ...sceneNodeResult,
    ...variableConsumptionMapResult,
    ...childrenResult,
    ...overridesResult
  };
};
