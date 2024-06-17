import { Uuid } from '@ui/lib/types/utils/uuid';

export const ITEM_MARGIN_SIMPLE_TYPE: unique symbol = Symbol.for('simple');
export const ITEM_MARGIN_MULTIPLE_TYPE: unique symbol = Symbol.for('multiple');
export const ITEM_SIZING_FILL: unique symbol = Symbol.for('fill');
export const ITEM_SIZING_FIX: unique symbol = Symbol.for('fix');
export const ITEM_SIZING_AUTO: unique symbol = Symbol.for('auto');
export const ITEM_ALIGN_SELF_START: unique symbol = Symbol.for('start');
export const ITEM_ALIGN_SELF_END: unique symbol = Symbol.for('end');
export const ITEM_ALIGN_SELF_CENTER: unique symbol = Symbol.for('center');
export const ITEM_ALIGN_SELF_STRETCH: unique symbol = Symbol.for('stretch');

export type LayoutSizing =
  | 'fill'
  | 'fix'
  | 'auto'
  | typeof ITEM_SIZING_FILL
  | typeof ITEM_SIZING_FIX
  | typeof ITEM_SIZING_AUTO;

export type LayoutChildAttributes = {
  'layout-item-margin-type'?:
    | 'simple'
    | 'multiple'
    | typeof ITEM_MARGIN_SIMPLE_TYPE
    | typeof ITEM_MARGIN_MULTIPLE_TYPE;
  'layout-item-margin'?: {
    m1?: number;
    m2?: number;
    m3?: number;
    m4?: number;
  };
  'layout-item-max-h'?: number;
  'layout-item-min-h'?: number;
  'layout-item-max-w'?: number;
  'layout-item-min-w'?: number;
  'layout-item-h-sizing'?: LayoutSizing;
  'layout-item-v-sizing'?: LayoutSizing;
  'layout-item-align-self'?:
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | typeof ITEM_ALIGN_SELF_START
    | typeof ITEM_ALIGN_SELF_END
    | typeof ITEM_ALIGN_SELF_CENTER
    | typeof ITEM_ALIGN_SELF_STRETCH;
  'layout-item-absolute'?: boolean;
  'layout-item-z-Index'?: number;
};

export type JustifyAlignContent =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch';

export type JustifyAlignItems = 'start' | 'end' | 'center' | 'stretch';

export type LayoutFlexDir =
  | 'row'
  | 'reverse-row'
  | 'row-reverse'
  | 'column'
  | 'reverse-column'
  | 'column-reverse';

export type LayoutGap = {
  'row-gap'?: number;
  'column-gap'?: number;
};

export type LayoutWrapType = 'wrap' | 'nowrap' | 'no-wrap';

export type LayoutPadding = {
  p1?: number;
  p2?: number;
  p3?: number;
  p4?: number;
};

export type LayoutAttributes = {
  'layout'?: 'flex' | 'grid';
  'layout-flex-dir'?: LayoutFlexDir;
  'layout-gap'?: LayoutGap;
  'layout-gap-type'?: 'simple' | 'multiple';
  'layout-wrap-type'?: LayoutWrapType;
  'layout-padding-type'?: 'simple' | 'multiple';
  'layout-padding'?: LayoutPadding;
  'layout-justify-content'?: JustifyAlignContent;
  'layout-justify-items'?: JustifyAlignItems;
  'layout-align-content'?: JustifyAlignContent;
  'layout-align-items'?: JustifyAlignItems;
  'layout-grid-dir'?: 'row' | 'column';
  'layout-grid-rows'?: GridTrack[];
  'layout-grid-columns'?: GridTrack[];
  'layout-grid-cells'?: { [uuid: Uuid]: GridCell };
};

type GridTrack = {
  type: 'percent' | 'flex' | 'auto' | 'fixed';
  value?: number;
};

type GridCell = {
  'id'?: Uuid;
  'area-name'?: string;
  'row': number;
  'row-span': number;
  'column': number;
  'column-span': number;
  'position'?: 'auto' | 'manual' | 'area';
  'align-self'?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  'justify-self'?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  'shapes'?: Uuid[];
};
