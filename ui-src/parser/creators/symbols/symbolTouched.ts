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
  const propertyReferenceVisible2 = componentPropertyReferences.characters;

  if (propertyReferenceVisible) {
    if (
      visible !== componentProperties.get(propertyReferenceVisible)?.defaultValue &&
      !touched?.includes(':visibility-group')
    ) {
      touched?.push(':visibility-group');
    }
  }

  if (propertyReferenceVisible2) {
    if (
      characters !== componentProperties.get(propertyReferenceVisible2)?.defaultValue &&
      !touched?.includes(':content-group')
    ) {
      touched?.push(':content-group');
    }
  }

  console.log('touched', touched);

  return touched;
};
