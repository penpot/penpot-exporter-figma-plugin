import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { components } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import type { ComponentInstance, UiComponent } from '@ui/types';

let remoteFileId: Uuid | undefined = undefined;

export const createComponentInstance = (
  context: PenpotContext,
  { type: _type, mainComponentId, isComponentRoot, ...shape }: ComponentInstance
): void => {
  const uiComponent =
    components.get(mainComponentId) ?? createUiComponent(context, mainComponentId);

  if (!uiComponent) {
    return;
  }

  if (!shape.shapeRef) {
    shape.shapeRef = uiComponent.mainInstanceId;
  }
  shape.componentFile = shape.isOrphan ? getRemoteFileId(context) : context.currentFileId;
  shape.componentRoot = isComponentRoot;
  shape.componentId = uiComponent.componentId;

  createArtboard(context, shape);
};

const createUiComponent = (context: PenpotContext, mainComponentId: string): UiComponent => {
  const uiComponent: UiComponent = {
    componentId: context.genId(),
    mainInstanceId: mainComponentId
  };

  components.set(mainComponentId, uiComponent);

  return uiComponent;
};

const getRemoteFileId = (context: PenpotContext): Uuid => {
  if (!remoteFileId) {
    remoteFileId = context.genId();
  }

  return remoteFileId;
};
