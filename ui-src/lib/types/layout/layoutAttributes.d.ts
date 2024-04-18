import { GridCell } from '@ui/lib/types/layout/gridCell';
import { GridTrack } from '@ui/lib/types/layout/gridTrack';
import { Uuid } from '@ui/lib/types/utils/uuid';

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
  layoutJustifyContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  layoutJustifyItems?: 'start' | 'end' | 'center' | 'stretch';
  layoutAlignContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  layoutAlignItems?: 'start' | 'end' | 'center' | 'stretch';
  layoutGridDir?: 'row' | 'column';
  layoutGridRows?: GridTrack[];
  layoutGridColumns?: GridTrack[];
  layoutGridCells?: { [uuid: Uuid]: GridCell };
};
