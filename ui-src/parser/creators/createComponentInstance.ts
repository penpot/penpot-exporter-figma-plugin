import { PenpotFile } from '@ui/lib/types/penpotFile';
import { components, instances, parseFigmaId } from '@ui/parser';
import { symbolTouched } from '@ui/parser/creators/symbols';
import { ComponentInstance } from '@ui/types';

import { createArtboard } from '.';

export const createComponentInstance = (
  file: PenpotFile,
  { type, mainComponentFigmaId, isComponentRoot, ...shape }: ComponentInstance
) => {
  const uiComponent =
    components.get(mainComponentFigmaId) ?? createUiComponent(file, mainComponentFigmaId);

  if (!uiComponent) {
    return;
  }

  const originalComponentFigmaId = originalId(shape.figmaId);
  const originalUiComponent =
    originalComponentFigmaId && originalComponentFigmaId !== mainComponentFigmaId
      ? components.get(originalComponentFigmaId) ??
        createUiComponent(file, originalComponentFigmaId)
      : undefined;

  if (!shape.figmaRelatedId) {
    shape.shapeRef = uiComponent.mainInstanceId;
  }
  shape.componentFile = file.getId();
  shape.componentRoot = isComponentRoot;
  shape.componentId = uiComponent.componentId;
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences,
    originalUiComponent
  );

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

  components.set(mainComponentFigmaId, uiComponent);

  return uiComponent;
};

const originalId = (figmaId: string | undefined) => {
  const originalFigmaId = figmaId?.split(';').pop();

  if (originalFigmaId) {
    return instances.get(originalFigmaId);
  }
};
