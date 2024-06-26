import { PenpotFile } from '@ui/lib/types/penpotFile';
import { componentShapes, components } from '@ui/parser';
import { ComponentRoot } from '@ui/types';

import { createArtboard } from '.';

export const createComponent = (file: PenpotFile, { figmaId }: ComponentRoot) => {
  const componentShape = componentShapes.get(figmaId);

  if (!componentShape) {
    return;
  }

  const componentId = getComponentId(file, figmaId);
  const { type, ...shape } = componentShape;

  shape.componentFile = file.getId();
  shape.componentId = componentId;
  shape.componentRoot = true;
  shape.mainInstance = true;

  const frameId = createArtboard(file, shape);

  if (!frameId) {
    return;
  }

  components.set(figmaId, {
    componentId,
    mainInstancePage: file.getCurrentPageId(),
    componentFigmaId: figmaId,
    mainInstanceId: frameId
  });
};

const getComponentId = (file: PenpotFile, figmaId: string) => {
  const component = components.get(figmaId);

  return component?.componentId ?? file.newId();
};
