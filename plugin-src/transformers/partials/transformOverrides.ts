import { overridesLibrary } from '@plugin/OverridesLibrary';

export const transformOverrides = (node: SceneNode) => {
  const overrides = overridesLibrary.get(node.id);
  if (!overrides) {
    return {};
  }

  return {
    touched: []
  };
};
