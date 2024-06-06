import { componentsLibrary } from '@plugin/ComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiComponents } from '@ui/parser/libraries';
import { ComponentRoot } from '@ui/types';

import { createArtboard } from '.';

export const createComponent = (file: PenpotFile, { figmaId }: ComponentRoot) => {
  const component = componentsLibrary.get(figmaId);
  if (!component) {
    return;
  }

  const uiComponent = uiComponents.get(figmaId);
  const componentId = uiComponent?.componentId ?? file.newId();

  const frameId = createArtboard(file, {
    ...component,
    componentFile: file.getId(),
    componentId,
    componentRoot: true,
    mainInstance: true,
    type: 'frame'
  });

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
