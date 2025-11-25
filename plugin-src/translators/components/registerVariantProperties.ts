import { variantProperties } from '@plugin/libraries';
import { transformId } from '@plugin/transformers/partials';

export const registerVariantProperties = (node: ComponentSetNode): void => {
  const variants = node.children;

  const variantPropertyNames = new Set<string>();

  for (const variant of variants) {
    const properties = variant.name.split(',');

    for (const pair of properties) {
      const [name] = pair.split('=').map(s => s.trim());

      variantPropertyNames.add(name);
    }
  }

  variantProperties.set(transformId(node), variantPropertyNames);
};
