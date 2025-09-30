import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { components, parseFigmaId } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import type { ComponentInstance, UiComponent } from '@ui/types';

let remoteFileId: Uuid | undefined = undefined;

export const createComponentInstance = (
  context: PenpotContext,
  { type: _type, mainComponentFigmaId, isComponentRoot, ...shape }: ComponentInstance
): void => {
  const uiComponent =
    components.get(mainComponentFigmaId) ?? createUiComponent(context, mainComponentFigmaId);

  if (!uiComponent) {
    return;
  }

  if (!shape.figmaRelatedId) {
    shape.shapeRef = uiComponent.mainInstanceId;
  }
  shape.componentFile = shape.isOrphan ? getRemoteFileId(context) : context.currentFileId;
  shape.componentRoot = isComponentRoot;
  shape.componentId = uiComponent.componentId;

  createArtboard(context, shape);
};

const createUiComponent = (
  context: PenpotContext,
  mainComponentFigmaId: string
): UiComponent | undefined => {
  const mainInstanceId = parseFigmaId(context, mainComponentFigmaId);
  if (!mainInstanceId) {
    return;
  }

  const uiComponent = {
    componentId: context.genId(),
    componentFigmaId: mainComponentFigmaId,
    mainInstanceId
  };

  components.set(mainComponentFigmaId, uiComponent);

  return uiComponent;
};

const getRemoteFileId = (context: PenpotContext): Uuid => {
  if (!remoteFileId) {
    remoteFileId = context.genId();
  }

  return remoteFileId;
};
