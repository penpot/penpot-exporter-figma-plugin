import type { VariantShape } from '@ui/lib/types/shapes/variant';

export const transformVariantName = (node: ComponentNode): VariantShape => {
  return {
    variantName: node.name
      .split(',')
      .map(part => {
        const value = part.split('=')[1];
        return value ? value.trim() : part.trim();
      })
      .join(', ')
  };
};
