import { PenpotFile } from '@ui/lib/types/penpotFile';
import { components, instances, parseFigmaId, swaps } from '@ui/parser';
import { symbolTouched } from '@ui/parser/creators/symbols';
import { ComponentInstance } from '@ui/types';

import { createArtboard } from '.';

export const createComponentInstance = (
  file: PenpotFile,
  { type, mainComponentFigmaId, isComponentRoot, ...shape }: ComponentInstance
) => {
  const { id, shapeRef } = parseFigmaId(file, shape.figmaId);
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

  if (originalUiComponent && shape.figmaId) {
    const index = shape.figmaId.lastIndexOf(';');

    swaps.push({
      original: shape.figmaId,
      swapped: index !== -1 ? shape.figmaId.substring(0, index) : shape.figmaId
    });
  }

  shape.id = id;
  shape.shapeRef = originalUiComponent ? uiComponent.mainInstanceId : shapeRef;
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
  const { id } = parseFigmaId(file, mainComponentFigmaId);

  if (!id) {
    return;
  }

  const uiComponent = {
    componentId: file.newId(),
    componentFigmaId: mainComponentFigmaId,
    mainInstanceId: id
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
