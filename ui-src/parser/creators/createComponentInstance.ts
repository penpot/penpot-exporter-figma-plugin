import { PenpotFile } from '@ui/lib/types/penpotFile';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { components, parseFigmaId } from '@ui/parser';
import { ComponentInstance } from '@ui/types';

import { createArtboard } from '.';

let remoteFileId: Uuid | undefined = undefined;

export const createComponentInstance = (
  file: PenpotFile,
  { type, mainComponentFigmaId, isComponentRoot, ...shape }: ComponentInstance
) => {
  const uiComponent =
    components.get(mainComponentFigmaId) ?? createUiComponent(file, mainComponentFigmaId);

  if (!uiComponent) {
    return;
  }

  if (!shape.figmaRelatedId) {
    shape.shapeRef = uiComponent.mainInstanceId;
  }
  shape.componentFile = shape.isOrphan ? getRemoteFileId(file) : file.getId();
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

  components.set(mainComponentFigmaId, uiComponent);

  return uiComponent;
};

const getRemoteFileId = (file: PenpotFile): Uuid => {
  if (!remoteFileId) {
    remoteFileId = file.newId();
  }

  return remoteFileId;
};
