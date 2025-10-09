import { variantProperties } from '@plugin/libraries';

import type { VariantComponent } from '@ui/lib/types/shapes/variant';

export const transformVariantProperties = (node: ComponentNode): VariantComponent => {
  const properties = node.name.split(',').map(pair => {
    const [name, value] = pair.split('=').map(s => s.trim());
    return { name, value };
  });

  properties.forEach(property => {
    if (!variantProperties.has(property.name)) {
      variantProperties.set(property.name, property);
    }
  });

  return {
    variantProperties: properties
  };
};
