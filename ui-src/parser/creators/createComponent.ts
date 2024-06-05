import { componentsLibrary } from '@plugin/ComponentLibrary';
import { remoteComponentsLibrary } from '@plugin/RemoteComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { remoteUiComponents, uiComponents } from '@ui/parser/libraries';
import { ComponentRoot } from '@ui/types';

import { createArtboard } from '.';

export const createComponent = (
  file: PenpotFile,
  { figmaId }: ComponentRoot,
  remote: boolean = false
) => {
  const library = remote ? remoteComponentsLibrary : componentsLibrary;
  const uiLibrary = remote ? remoteUiComponents : uiComponents;

  const component = library.get(figmaId);
  if (!component) {
    return;
  }

  const uiComponent = uiLibrary.get(figmaId);
  const componentId = uiComponent?.componentId ?? file.newId();

  const frameId = createArtboard(
    file,
    {
      ...component,
      showContent: true,
      componentFile: file.getId(),
      componentId,
      componentRoot: true,
      mainInstance: true,
      type: 'frame'
    },
    remote
  );

  if (!frameId) {
    return;
  }

  uiLibrary.register(figmaId, {
    componentId,
    mainInstancePage: file.getCurrentPageId(),
    componentFigmaId: figmaId,
    mainInstanceId: frameId
  });
};
