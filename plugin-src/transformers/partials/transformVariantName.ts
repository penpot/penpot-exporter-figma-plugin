import type { VariantShape } from '@ui/lib/types/shapes/variant';

const generateName = (properties: { [property: string]: string } | null): string | undefined => {
  if (!properties) {
    return undefined;
  }

  return Object.entries(properties)
    .map(([_key, value]) => value)
    .join(', ');
};

export const transformVariantName = (node: ComponentNode): VariantShape => {
  try {
    return {
      variantName: generateName(node.variantProperties)
    };
  } catch (error) {
    console.warn(
      '[transformVariantName] Could not access variant properties for node:',
      node.name,
      ', with id: ',
      node.id,
      error
    );
    return {
      variantName: node.name
        .split(',')
        .map(part => {
          const value = part.split('=')[1];
          return value ? value.trim() : part.trim();
        })
        .join(', ')
    };
  }
};
