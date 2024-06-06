import { PenpotFile } from '@ui/lib/types/penpotFile';
import { parseFigmaId } from '@ui/parser';
import { uiComponents } from '@ui/parser/libraries';
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
    ...rest
  }: ComponentInstance
) => {
  let uiComponent = uiComponents.get(mainComponentFigmaId);

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
    uiComponents.register(mainComponentFigmaId, uiComponent);
  }

  createArtboard(file, {
    ...rest,
    shapeRef: uiComponent.mainInstanceId,
    componentFile: file.getId(),
    componentRoot: isComponentRoot,
    componentId: uiComponent.componentId,
    type: 'frame'
  });
};
