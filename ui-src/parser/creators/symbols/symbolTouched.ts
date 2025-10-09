import type { SyncGroups } from '@ui/lib/types/utils/syncGroups';
import { componentProperties } from '@ui/parser';
import type { ComponentPropertyReference } from '@ui/types';

export const symbolTouched = (
  visible: boolean | undefined,
  characters: string | undefined,
  touched: SyncGroups[] | undefined,
  componentPropertyReferences: ComponentPropertyReference | undefined
): SyncGroups[] | undefined => {
  if (!componentPropertyReferences) {
    return touched;
  }

  const touchedResult = touched ?? [];
  const propertyReferenceVisible = componentPropertyReferences.visible;
  const propertyReferenceCharacters = componentPropertyReferences.characters;

  if (
    propertyReferenceVisible &&
    visible !== componentProperties.get(propertyReferenceVisible)?.defaultValue &&
    !touchedResult.includes('visibility-group')
  ) {
    touchedResult.push('visibility-group');
  }

  if (
    propertyReferenceCharacters &&
    characters !== componentProperties.get(propertyReferenceCharacters)?.defaultValue
  ) {
    if (!touchedResult.includes('content-group')) {
      touchedResult.push('content-group');
    }

    if (!touchedResult.includes('text-content-text')) {
      touchedResult.push('text-content-text');
    }
  }

  return touchedResult;
};
