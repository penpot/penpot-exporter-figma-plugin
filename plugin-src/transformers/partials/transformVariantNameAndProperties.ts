import { variantProperties } from '@plugin/libraries';

import type { VariantComponent, VariantShape } from '@ui/lib/types/shapes/variant';

export const transformVariantNameAndProperties = (
  node: ComponentNode
): Pick<VariantComponent, 'variantProperties'> & Pick<VariantShape, 'variantName'> => {
  const id = node.parent?.id ?? '';

  const componentPropertyNames = variantProperties.get(id) ?? new Set();

  const properties = node.name.split(',').map(pair => {
    const [name, value] = pair.split('=').map(s => s.trim());

    componentPropertyNames.add(name);

    return { name, value };
  });

  variantProperties.set(id, componentPropertyNames);

  return {
    variantName: properties.map(prop => prop.value).join(', '),
    variantProperties: properties
  };
};
