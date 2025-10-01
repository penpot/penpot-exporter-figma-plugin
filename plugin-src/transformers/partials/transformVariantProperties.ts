import type { VariantAttributes, VariantProperty } from '@ui/lib/types/shapes/componentShape';

const generateName = (properties: { [property: string]: string }): string => {
  return Object.entries(properties)
    .map(([_key, value]) => value)
    .join(', ');
};

const generateProperties = (properties: { [property: string]: string }): VariantProperty[] => {
  return Object.entries(properties).map(([name, value]) => ({ name, value }));
};

export const transformVariantProperties = (node: ComponentNode): VariantAttributes => {
  const { variantProperties } = node;
  const name = generateName(variantProperties ?? {});

  const properties = generateProperties(variantProperties ?? {});

  return {
    variantName: name,
    variantProperties: properties
  };
};
