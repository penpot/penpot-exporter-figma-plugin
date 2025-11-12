import { variantProperties } from '@plugin/libraries';

import type { VariantComponent, VariantShape } from '@ui/lib/types/shapes/variant';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export const transformVariantNameAndProperties = (
  node: ComponentNode,
  variantId: Uuid
): Pick<VariantComponent, 'variantProperties'> & Pick<VariantShape, 'variantName'> => {
  const componentPropertyNames = variantProperties.get(variantId) ?? new Set();

  const properties = node.name.split(',').map(pair => {
    const [name, value] = pair.split('=').map(s => s.trim());

    componentPropertyNames.add(name);

    return { name, value };
  });

  variantProperties.set(variantId, componentPropertyNames);

  return {
    variantName: properties.map(prop => prop.value).join(', '),
    variantProperties: properties
  };
};
