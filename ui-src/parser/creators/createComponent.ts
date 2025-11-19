import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { componentRoots, components } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import { symbolVariantProperties } from '@ui/parser/creators/symbols';
import type { UiComponent } from '@ui/types';

export const createComponent = (
  context: PenpotContext,
  { type: _type, path, variantProperties, ...shape }: ComponentShape
): void => {
  const componentRoot = componentRoots.get(shape.id);

  if (!componentRoot) {
    return;
  }

  const { componentId, frameId, name, variantId } = componentRoot;

  const component: UiComponent = {
    componentId,
    frameId,
    name,
    variantId,
    path,
    pageId: context.currentPageId,
    fileId: context.currentFileId,
    variantProperties: symbolVariantProperties(variantProperties, variantId)
  };

  components.set(shape.id, component);

  shape.componentFile = context.currentFileId;

  createArtboard(context, shape);
};
