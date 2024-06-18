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
    ...shape
  }: ComponentInstance
) => {
  const uiComponent =
    uiComponents.get(mainComponentFigmaId) ?? createUiComponent(file, mainComponentFigmaId);

  if (!uiComponent) {
    return;
  }

  shape.shapeRef = uiComponent.mainInstanceId;
  shape.componentFile = file.getId();
  shape.componentRoot = isComponentRoot;
  shape.componentId = uiComponent.componentId;

  createArtboard(file, shape);
};

const createUiComponent = (file: PenpotFile, mainComponentFigmaId: string) => {
  const mainInstanceId = parseFigmaId(file, mainComponentFigmaId);
  if (!mainInstanceId) {
    return;
  }

  const uiComponent = {
    componentId: file.newId(),
    componentFigmaId: mainComponentFigmaId,
    mainInstanceId
  };

  uiComponents.register(mainComponentFigmaId, uiComponent);

  return uiComponent;
};
