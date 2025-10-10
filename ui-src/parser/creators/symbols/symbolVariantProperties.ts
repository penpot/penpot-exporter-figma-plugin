import type { VariantProperty } from '@ui/lib/types/shapes/variant';
import { variantProperties } from '@ui/parser';

export const symbolVariantProperties = (
  currentVariantProperties: VariantProperty[] | undefined,
  componentId: string | undefined
): VariantProperty[] | undefined => {
  if (!componentId) {
    return currentVariantProperties;
  }

  const componentPropertyNames = variantProperties.get(componentId);

  if (!componentPropertyNames || componentPropertyNames.length === 0) {
    return currentVariantProperties;
  }

  const currentPropertyNames = new Map<string, VariantProperty>();
  for (const prop of currentVariantProperties ?? []) {
    currentPropertyNames.set(prop.name, prop);
  }

  return componentPropertyNames.map(
    propName => currentPropertyNames.get(propName) ?? { name: propName, value: '' }
  );
};
