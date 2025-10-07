import type { VariantShape } from '@ui/lib/types/shapes/variant';

const generateName = (properties: { [property: string]: string } | null): string | undefined => {
  if (!properties) {
    return undefined;
  }

  return Object.entries(properties)
    .map(([_key, value]) => value)
    .join(', ');
};

export const transformVariantName = ({ variantProperties }: ComponentNode): VariantShape => {
  return {
    variantName: generateName(variantProperties)
  };
};
