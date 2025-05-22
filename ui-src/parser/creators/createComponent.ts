import { PenpotContext } from '@ui/lib/types/penpotContext';
import { componentShapes, components } from '@ui/parser';
import { ComponentRoot } from '@ui/types';

import { createArtboard } from '.';

export const createComponent = (context: PenpotContext, { figmaId }: ComponentRoot) => {
  const componentShape = componentShapes.get(figmaId);

  if (!componentShape) {
    return;
  }

  const componentId = getComponentId(context, figmaId);
  const { type, ...shape } = componentShape;

  shape.componentFile = context.currentFileId;
  shape.componentId = componentId;
  shape.componentRoot = true;
  shape.mainInstance = true;

  const frameId = createArtboard(context, shape);

  if (!frameId) {
    return;
  }

  components.set(figmaId, {
    componentId,
    mainInstancePage: context.currentPageId,
    componentFigmaId: figmaId,
    mainInstanceId: frameId
  });
};

const getComponentId = (context: PenpotContext, figmaId: string) => {
  const component = components.get(figmaId);

  return component?.componentId ?? context.genId();
};
