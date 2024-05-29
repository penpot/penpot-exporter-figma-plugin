import { componentsLibrary } from '@plugin/ComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiComponents } from '@ui/parser/libraries';
import { ComponentRoot } from '@ui/types';

import { createArtboard } from '.';

export const createComponent = (file: PenpotFile, { figmaId }: ComponentRoot) => {
  const frameId = file.newId();
  const componentId = file.newId();

  const component = componentsLibrary.get(figmaId);
  if (!component) {
    return;
  }

  createArtboard(file, {
    ...component,
    componentFile: file.getId(),
    componentId: componentId,
    componentRoot: true,
    mainInstance: true,
    id: frameId,
    type: 'frame'
  });

  uiComponents.register(figmaId, {
    componentId,
    mainInstancePage: file.getCurrentPageId(),
    componentFigmaId: figmaId,
    mainInstanceId: frameId
  });
};
