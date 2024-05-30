import { PenpotFile } from '@ui/lib/types/penpotFile';
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
  const uiComponent = uiComponents.get(mainComponentFigmaId);
  if (!uiComponent) {
    return;
  }

  createArtboard(file, {
    ...rest,
    showContent: true,
    shapeRef: uiComponent.mainInstanceId,
    componentFile: file.getId(),
    componentRoot: isComponentRoot,
    componentId: uiComponent.componentId,
    type: 'frame'
  });
};
