import { componentsLibrary } from '@plugin/ComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiComponents } from '@ui/parser/libraries';
import { ComponentRoot } from '@ui/types';

import { createArtboard } from '.';

export const createComponent = (file: PenpotFile, componentRelationship: ComponentRoot) => {
  const frameId = file.newId();
  const componentId = file.newId();

  const component = componentsLibrary.get(componentRelationship.figmaId);
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

  uiComponents.register(componentRelationship.figmaId, {
    componentId,
    mainInstancePage: file.getCurrentPageId(),
    componentFigmaId: componentRelationship.figmaId,
    mainInstanceId: frameId
  });
};
