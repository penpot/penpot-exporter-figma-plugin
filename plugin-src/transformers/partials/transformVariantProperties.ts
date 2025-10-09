import { variantProperties } from '@plugin/libraries';

import type { VariantComponent } from '@ui/lib/types/shapes/variant';

export const transformVariantProperties = (node: ComponentNode): VariantComponent => {
  const id = node.parent?.id ?? '';

  const properties = node.name.split(',').map(pair => {
    const [name, value] = pair.split('=').map(s => s.trim());
    return { name, value };
  });

  if (!variantProperties.has(id)) {
    variantProperties.set(id, []);
  }

  const componentPropertyNames = variantProperties.get(id)!;

  properties.forEach(property => {
    if (!componentPropertyNames.includes(property.name)) {
      componentPropertyNames.push(property.name);
    }
  });

  return {
    variantProperties: properties
  };
};
