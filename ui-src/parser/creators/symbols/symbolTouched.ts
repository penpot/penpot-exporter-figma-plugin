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

  Object.entries(componentPropertyReferences).forEach(([key, value]) => {
    switch (key) {
      case 'visible':
        if (visible !== componentProperties.get(value)?.defaultValue) {
          touched?.push(':visibility-group');
        }
        break;
      case 'characters':
        if (characters !== componentProperties.get(value)?.defaultValue) {
          touched?.push(':content-group');
        }
        break;
      default:
        break;
    }
  });

  return touched;
};
