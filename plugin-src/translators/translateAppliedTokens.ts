import { variables } from '@plugin/libraries';

import type { TokenProperties } from '@ui/lib/types/shapes/tokens';

export const translateAppliedTokens = (
  boundVariables: SceneNodeMixin['boundVariables']
): { [key in TokenProperties]?: string } => {
  if (!boundVariables) return {};

  const appliedTokens: { [key in TokenProperties]?: string } = {};

  if (boundVariables.opacity) {
    const opacityVariable = variables.get(`${boundVariables.opacity.id}.opacity`);

    if (opacityVariable) {
      appliedTokens.opacity = opacityVariable;
    }
  }

  console.log(appliedTokens);

  return appliedTokens;
};
