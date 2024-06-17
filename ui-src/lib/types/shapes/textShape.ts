import { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import { Fill } from '@ui/lib/types/utils/fill';

export type TextShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  TextAttributes &
  LayoutChildAttributes;

export type TextAttributes = {
  type?: 'text';
  content?: TextContent;
};

export type TextContent = {
  'type': 'root';
  'key'?: string;
  'vertical-align'?: TextVerticalAlign;
  'children'?: ParagraphSet[];
};

export type TextVerticalAlign = 'top' | 'bottom' | 'center';
export type TextHorizontalAlign = 'left' | 'right' | 'center' | 'justify';
export type TextFontStyle = 'normal' | 'italic';

export type ParagraphSet = {
  type: 'paragraph-set';
  key?: string;
  children: Paragraph[];
};

export type Paragraph = {
  type: 'paragraph';
  key?: string;
  children: TextNode[];
} & TextStyle;

export type TextNode = {
  text: string;
  key?: string;
} & TextStyle;

export type TextStyle = FontId & {
  'font-family'?: string;
  'font-size'?: string;
  'font-style'?: TextFontStyle;
  'font-weight'?: string;
  'text-decoration'?: string;
  'text-transform'?: string;
  'direction'?: string;
  'typography-ref-id'?: string;
  'typography-ref-file'?: string;
  'line-height'?: number;
  'letter-spacing'?: number;
  'text-align'?: TextHorizontalAlign;
  'text-direction'?: 'ltr' | 'rtl' | 'auto';
  'fills'?: Fill[];
};

export type FontId = {
  'font-id'?: string;
  'font-variant-id'?: string;
};
