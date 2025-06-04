import { PenpotContext } from '@ui/lib/types/penpotContext';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { components, parseFigmaId } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import { ComponentInstance } from '@ui/types';

let remoteFileId: Uuid | undefined = undefined;

export const createComponentInstance = (
  context: PenpotContext,
  { type, mainComponentFigmaId, isComponentRoot, ...shape }: ComponentInstance
) => {
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

const createUiComponent = (context: PenpotContext, mainComponentFigmaId: string) => {
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
