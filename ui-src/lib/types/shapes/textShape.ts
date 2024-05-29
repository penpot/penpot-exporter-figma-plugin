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
  type: 'root';
  key?: string;
  verticalAlign?: TextVerticalAlign;
  children?: ParagraphSet[];
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
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: TextFontStyle;
  fontWeight?: string;
  textDecoration?: string;
  textTransform?: string;
  direction?: string;
  typographyRefId?: string;
  typographyRefFile?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: TextHorizontalAlign;
  textDirection?: 'ltr' | 'rtl' | 'auto';
  fills?: Fill[];
};

export type FontId = {
  fontId?: string;
  fontVariantId?: string;
};
