import type { VariantComponent, VariantProperty } from '@ui/lib/types/shapes/variant';

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
}: ComponentNode): VariantComponent => {
  return {
    variantProperties: generateProperties(variantProperties)
  };
};
