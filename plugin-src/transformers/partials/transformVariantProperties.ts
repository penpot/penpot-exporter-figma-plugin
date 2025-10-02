import type { VariantAttributes, VariantProperty } from '@ui/lib/types/shapes/componentShape';

const generateName = (properties: { [property: string]: string } | null): string | undefined => {
  if (!properties) {
    return undefined;
  }

  return Object.entries(properties)
    .map(([_key, value]) => value)
    .join(', ');
};

const generateProperties = (
  properties: { [property: string]: string } | null
): VariantProperty[] | undefined => {
  if (!properties) {
    return undefined;
  }

  return Object.entries(properties).map(([name, value]) => ({ name, value }));
};

export const transformVariantProperties = ({
  variantProperties
}: ComponentNode): VariantAttributes => {
  return {
    variantName: generateName(variantProperties),
    variantProperties: generateProperties(variantProperties)
  };
};
