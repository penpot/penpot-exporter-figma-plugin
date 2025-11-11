import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { componentShapes, components } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import { symbolVariantProperties } from '@ui/parser/creators/symbols';
import type { ComponentRoot } from '@ui/types';

export const createComponent = (context: PenpotContext, { id, variantId }: ComponentRoot): void => {
  const componentShape = componentShapes.get(id);

  if (!componentShape) {
    return;
  }

  const componentId = getComponentId(context, id);
  const { type: _type, path, variantProperties, ...shape } = componentShape;

  shape.componentFile = context.currentFileId;
  shape.componentId = componentId;
  shape.componentRoot = true;
  shape.mainInstance = true;
  shape.variantId = variantId;

  const frameId = createArtboard(context, shape);

  if (!frameId) {
    return;
  }

  components.set(id, {
    componentId,
    path,
    mainInstancePage: context.currentPageId,
    mainInstanceId: frameId,
    variantId,
    variantProperties: symbolVariantProperties(variantProperties, variantId)
  });
};

const getComponentId = (context: PenpotContext, id: string): string | Uuid => {
  const component = components.get(id);

  return component?.componentId ?? context.genId();
};
