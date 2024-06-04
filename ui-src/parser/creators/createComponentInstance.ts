import { PenpotFile } from '@ui/lib/types/penpotFile';
import { parseFigmaId } from '@ui/parser';
import { remoteUiComponents, uiComponents } from '@ui/parser/libraries';
import { ComponentInstance } from '@ui/types';

import { createArtboard } from '.';

export const createComponentInstance = (
  file: PenpotFile,
  {
    type,
    mainComponentFigmaId,
    figmaId,
    figmaRelatedId,
    isComponentRoot,
    isRemoteComponent,
    ...rest
  }: ComponentInstance,
  remote: boolean = false
) => {
  const uiLibrary = remote || isRemoteComponent ? remoteUiComponents : uiComponents;
  let uiComponent = uiLibrary.get(mainComponentFigmaId);

  if (!uiComponent) {
    const mainInstanceId = parseFigmaId(file, mainComponentFigmaId);
    if (!mainInstanceId) {
      return;
    }

    uiComponent = {
      componentId: file.newId(),
      componentFigmaId: mainComponentFigmaId,
      mainInstanceId
    };
    uiLibrary.register(mainComponentFigmaId, uiComponent);
  }

  createArtboard(
    file,
    {
      ...rest,
      showContent: true,
      shapeRef: uiComponent.mainInstanceId,
      componentFile: file.getId(),
      componentRoot: isComponentRoot,
      componentId: uiComponent.componentId,
      type: 'frame'
    },
    remote
  );
};
