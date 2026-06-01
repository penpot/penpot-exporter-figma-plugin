import {
  type Drawable,
  type PathBounds,
  computePathBounds,
  parseDrawables
} from '@plugin/translators/shapeWithText/extractDrawables';
import { serializeCommands } from '@plugin/translators/vectors';

export type DrawablePathContent = {
  content: string;
  bounds: PathBounds;
};

export const buildPathContentFromDrawables = (
  drawables: Drawable[],
  aabb: Rect,
  onParseError: (pathData: string) => void
): DrawablePathContent | undefined => {
  const subpaths = parseDrawables(drawables, onParseError);
  const bounds = computePathBounds(subpaths);
  if (!bounds) return;

  const toCanvas: Transform = [
    [1, 0, aabb.x - bounds.minX],
    [0, 1, aabb.y - bounds.minY]
  ];
  const content = subpaths
    .map(commands => serializeCommands(commands, toCanvas))
    .join(' ')
    .trim();
  if (!content) return;

  return { content, bounds };
};
