import type { VariantProperty } from '@ui/lib/types/shapes/variant';
import { variantProperties } from '@ui/parser';

export const symbolVariantProperties = (
  currentVariantProperties: VariantProperty[] | undefined,
  componentId: string
): { variantProperties?: VariantProperty[] } => {
  const componentPropertyNames = variantProperties.get(componentId);

  if (!componentPropertyNames || componentPropertyNames.length === 0) {
    return currentVariantProperties ? { variantProperties: currentVariantProperties } : {};
  }

  const currentPropertyNames = new Set(currentVariantProperties?.map(prop => prop.name) || []);

  const missingProperties = componentPropertyNames
    .filter(propName => !currentPropertyNames.has(propName))
    .map(propName => ({ name: propName, value: '' }));

  if (missingProperties.length > 0) {
    return {
      variantProperties: [...(currentVariantProperties || []), ...missingProperties]
    };
  }

  return currentVariantProperties ? { variantProperties: currentVariantProperties } : {};
};
