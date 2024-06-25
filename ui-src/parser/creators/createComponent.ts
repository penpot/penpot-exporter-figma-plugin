import { componentsLibrary } from '@plugin/libraries/ComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiComponents } from '@ui/parser/libraries';
import { ComponentRoot } from '@ui/types';

import { createArtboard } from '.';

export const createComponent = (file: PenpotFile, { figmaId }: ComponentRoot) => {
  const component = componentsLibrary.get(figmaId);

  if (!component) {
    return;
  }

  const componentId = getComponentId(file, figmaId);
  const { type, ...shape } = component;

  shape.componentFile = file.getId();
  shape.componentId = componentId;
  shape.componentRoot = true;
  shape.mainInstance = true;

  const frameId = createArtboard(file, shape);

  if (!frameId) {
    return;
  }

  uiComponents.register(figmaId, {
    componentId,
    mainInstancePage: file.getCurrentPageId(),
    componentFigmaId: figmaId,
    mainInstanceId: frameId
  });
};

const getComponentId = (file: PenpotFile, figmaId: string) => {
  const uiComponent = uiComponents.get(figmaId);

  return uiComponent?.componentId ?? file.newId();
};
