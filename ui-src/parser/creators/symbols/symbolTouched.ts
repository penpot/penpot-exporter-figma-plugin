import { SyncGroups } from '@ui/lib/types/utils/syncGroups';
import { componentProperties } from '@ui/parser';
import { ComponentPropertyReference } from '@ui/types';

export const symbolTouched = (
  visible: boolean | undefined,
  characters: string | undefined,
  touched: SyncGroups[] | undefined,
  componentPropertyReferences: ComponentPropertyReference | undefined
): SyncGroups[] | undefined => {
  if (!componentPropertyReferences) {
    return touched;
  }

  const propertyReferenceVisible = componentPropertyReferences.visible;
  const propertyReferenceCharacters = componentPropertyReferences.characters;

  if (propertyReferenceVisible) {
    if (
      visible !== componentProperties.get(propertyReferenceVisible)?.defaultValue &&
      !touched?.includes(':visibility-group')
    ) {
      touched?.push(':visibility-group');
    }
  }

  if (propertyReferenceCharacters) {
    if (
      characters !== componentProperties.get(propertyReferenceCharacters)?.defaultValue &&
      !touched?.includes(':content-group')
    ) {
      touched?.push(':content-group');
    }
  }

  return touched;
};
