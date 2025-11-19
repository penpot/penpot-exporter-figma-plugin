import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { componentRoots } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import type { ComponentInstance } from '@ui/types';

let remoteFileId: Uuid | undefined = undefined;

export const createComponentInstance = (
  context: PenpotContext,
  { type: _type, mainComponentId, ...shape }: ComponentInstance
): void => {
  const componentRoot = componentRoots.get(mainComponentId);

  if (!shape.shapeRef) {
    shape.shapeRef = mainComponentId;
  }

  shape.componentFile = componentRoot ? context.currentFileId : getRemoteFileId(context);
  shape.componentId = componentRoot ? componentRoot.componentId : context.genId();

  createArtboard(context, shape);
};

const getRemoteFileId = (context: PenpotContext): Uuid => {
  if (!remoteFileId) {
    remoteFileId = context.genId();
  }

  return remoteFileId;
};
