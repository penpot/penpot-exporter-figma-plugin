import { componentPropertiesLibrary } from '@plugin/ComponentPropertiesLibrary';

import { SyncGroups } from '@ui/lib/types/utils/syncGroups';
import { ComponentPropertyReference } from '@ui/types';

export const symbolTouched = (
  visible: boolean | undefined,
  characters: string | undefined,
  touched: SyncGroups[] | undefined,
  componentPropertyReferences: ComponentPropertyReference | undefined
): SyncGroups[] | undefined => {
  if (componentPropertyReferences) {
    Object.entries(componentPropertyReferences).forEach(([key, value]) => {
      switch (key) {
        case 'visible':
          if (visible !== componentPropertiesLibrary.get(value)?.defaultValue) {
            touched?.push(':visibility-group');
          }
          break;
        case 'characters':
          if (characters !== componentPropertiesLibrary.get(value)?.defaultValue) {
            touched?.push(':content-group');
          }
          break;
        default:
          break;
      }
    });
  }

  return touched;
};
