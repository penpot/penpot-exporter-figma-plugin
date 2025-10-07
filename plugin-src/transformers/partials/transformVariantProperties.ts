import type { VariantComponent, VariantProperty } from '@ui/lib/types/shapes/variant';

const generateProperties = (
  properties: { [property: string]: string } | null
): VariantProperty[] | undefined => {
  if (!properties) {
    return undefined;
  }

  return Object.entries(properties).map(([name, value]) => ({ name, value }));
};

export const transformVariantProperties = (node: ComponentNode): VariantComponent => {
  try {
    return {
      variantProperties: generateProperties(node.variantProperties)
    };
  } catch (error) {
    console.warn(
      '[transformVariantProperties] Could not access variant properties for node:',
      node.name,
      ', with id: ',
      node.id,
      error
    );
    return {
      variantProperties: []
    };
  }
};
