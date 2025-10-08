import type { VariantComponent } from '@ui/lib/types/shapes/variant';

export const transformVariantProperties = (node: ComponentNode): VariantComponent => {
  return {
    variantProperties: node.name.split(',').map(pair => {
      const [name, value] = pair.split('=').map(s => s.trim());
      return { name, value };
    })
  };
};
