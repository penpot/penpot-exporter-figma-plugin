import { Uuid } from '@ui/lib/types/utils/uuid';

export const ITEM_MARGIN_SIMPLE_TYPE: unique symbol = Symbol.for('simple');
export const ITEM_MARGIN_MULTIPLE_TYPE: unique symbol = Symbol.for('multiple');
export const ITEM_HSIZING_FILL: unique symbol = Symbol.for('fill');
export const ITEM_HSIZING_FIX: unique symbol = Symbol.for('fix');
export const ITEM_HSIZING_AUTO: unique symbol = Symbol.for('auto');
export const ITEM_VSIZING_FILL: unique symbol = Symbol.for('fill');
export const ITEM_VSIZING_FIX: unique symbol = Symbol.for('fix');
export const ITEM_VSIZING_AUTO: unique symbol = Symbol.for('auto');
export const ITEM_ALIGN_SELF_START: unique symbol = Symbol.for('start');
export const ITEM_ALIGN_SELF_END: unique symbol = Symbol.for('end');
export const ITEM_ALIGN_SELF_CENTER: unique symbol = Symbol.for('center');
export const ITEM_ALIGN_SELF_STRETCH: unique symbol = Symbol.for('stretch');

export type LayoutChildAttributes = {
  layoutItemMarginType?:
    | 'simple'
    | 'multiple'
    | typeof ITEM_MARGIN_SIMPLE_TYPE
    | typeof ITEM_MARGIN_MULTIPLE_TYPE;
  layoutItemMargin?: {
    m1?: number;
    m2?: number;
    m3?: number;
    m4?: number;
  };
  layoutItemMaxH?: number;
  layoutItemMinH?: number;
  layoutItemMaxW?: number;
  layoutItemMinW?: number;
  layoutItemHSizing?:
    | 'fill'
    | 'fix'
    | 'auto'
    | typeof ITEM_HSIZING_FILL
    | typeof ITEM_HSIZING_FIX
    | typeof ITEM_HSIZING_AUTO;
  layoutItemVSizing?:
    | 'fill'
    | 'fix'
    | 'auto'
    | typeof ITEM_VSIZING_FILL
    | typeof ITEM_VSIZING_FIX
    | typeof ITEM_VSIZING_AUTO;
  layoutItemAlignSelf?:
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | typeof ITEM_ALIGN_SELF_START
    | typeof ITEM_ALIGN_SELF_END
    | typeof ITEM_ALIGN_SELF_CENTER
    | typeof ITEM_ALIGN_SELF_STRETCH;
  layoutItemAbsolute?: boolean;
  layoutItemZIndex?: number;
};

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

type GridTrack = {
  type: 'percent' | 'flex' | 'auto' | 'fixed';
  value?: number;
};

type GridCell = {
  id?: Uuid;
  areaName?: string;
  row: number;
  rowSpan: number;
  column: number;
  columnSpan: number;
  position?: 'auto' | 'manual' | 'area';
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  shapes?: Uuid[];
};
