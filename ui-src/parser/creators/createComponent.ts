import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { componentShapes, components, parseFigmaId } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import { symbolVariantProperties } from '@ui/parser/creators/symbols';
import type { ComponentRoot } from '@ui/types';

export const createComponent = (
  context: PenpotContext,
  { figmaId, figmaVariantId }: ComponentRoot
): void => {
  const componentShape = componentShapes.get(figmaId);

  if (!componentShape) {
    return;
  }

  const componentId = getComponentId(context, figmaId);
  const { type: _type, path, variantProperties, ...shape } = componentShape;
  const variantId = parseFigmaId(context, figmaVariantId);

  shape.componentFile = context.currentFileId;
  shape.componentId = componentId;
  shape.componentRoot = true;
  shape.mainInstance = true;
  shape.variantId = variantId;

  const frameId = createArtboard(context, shape);

  if (!frameId) {
    return;
  }

  components.set(figmaId, {
    componentId,
    path,
    mainInstancePage: context.currentPageId,
    componentFigmaId: figmaId,
    mainInstanceId: frameId,
    variantId,
    ...symbolVariantProperties(variantProperties, figmaVariantId ?? '')
  });
};

const getComponentId = (context: PenpotContext, figmaId: string): string | Uuid => {
  const component = components.get(figmaId);

  return component?.componentId ?? context.genId();
};
