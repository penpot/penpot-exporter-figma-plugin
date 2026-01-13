import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { ComponentShape, PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import { componentRoots, components } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';

export const createComponent = (
  context: PenpotContext,
  { type: _type, path, variantProperties, ...shape }: ComponentShape
): void => {
  const componentRoot = componentRoots.get(shape.componentId!);

  if (!componentRoot) {
    return;
  }

  const { componentId, frameId, name, variantId } = componentRoot;

  const component: PenpotComponent = {
    componentId,
    frameId,
    name,
    path,
    pageId: context.currentPageId,
    fileId: context.currentFileId
  };

  if (variantId) {
    component.variantId = variantId;
  }

  if (variantProperties) {
    component.variantProperties = variantProperties;
  }

  components.set(shape.id, component);

  shape.componentFile = context.currentFileId;

  createArtboard(context, shape);
};
