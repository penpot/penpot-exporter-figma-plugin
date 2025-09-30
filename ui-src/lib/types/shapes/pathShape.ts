import type { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type { ShapeAttributes, ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';

export type PathShape = ShapeBaseAttributes &
  ShapeAttributes &
  PathAttributes &
  LayoutChildAttributes;

export type PathAttributes = {
  type?: 'path';
  content: string;
  svgAttrs?: {
    fillRule?: FillRules;
  };
};

export type FillRules = 'evenodd' | 'nonzero';
