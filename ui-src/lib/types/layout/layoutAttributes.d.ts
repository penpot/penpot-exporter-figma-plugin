import { GridCell } from '@ui/lib/types/layout/gridCell';
import { GridTrack } from '@ui/lib/types/layout/gridTrack';
import { Uuid } from '@ui/lib/types/utils/uuid';

type JustifyAlignContent =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch';

type JustifyAlignItems = 'start' | 'end' | 'center' | 'stretch';

export type LayoutAttributes = {
  layout?: 'flex' | 'grid';
  layoutFlexDir?:
    | 'row'
    | 'reverse-row'
    | 'row-reverse'
    | 'column'
    | 'reverse-column'
    | 'column-reverse';
  layoutGap?: {
    rowGap?: number;
    columnGap?: number;
  };
  layoutGapType?: 'simple' | 'multiple';
  layoutWrapType?: 'wrap' | 'nowrap' | 'no-wrap';
  layoutPaddingType?: 'simple' | 'multiple';
  layoutPadding?: {
    p1?: number;
    p2?: number;
    p3?: number;
    p4?: number;
  };
  layoutJustifyContent?: JustifyAlignContent;
  layoutJustifyItems?: JustifyAlignItems;
  layoutAlignContent?: JustifyAlignContent;
  layoutAlignItems?: JustifyAlignItems;
  layoutGridDir?: 'row' | 'column';
  layoutGridRows?: GridTrack[];
  layoutGridColumns?: GridTrack[];
  layoutGridCells?: { [uuid: Uuid]: GridCell };
};
