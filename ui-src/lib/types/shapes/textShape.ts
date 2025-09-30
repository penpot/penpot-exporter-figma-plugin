import type { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import type { Fill } from '@ui/lib/types/utils/fill';
import type { Typography } from '@ui/lib/types/utils/typography';

export type TextShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  TextAttributes &
  LayoutChildAttributes;

export type TextAttributes = {
  type?: 'text';
  content?: TextContent;
  characters?: string; // @ TODO: move to any other place
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

export type TextStyle = TextTypography & {
  textDecoration?: string;
  direction?: string;
  typographyRefId?: string;
  typographyRefFile?: string;
  textAlign?: TextHorizontalAlign;
  textDirection?: 'ltr' | 'rtl' | 'auto';
  fills?: Fill[];
  fillStyleId?: string; // @TODO: move to any other place
  textStyleId?: string; // @TODO: move to any other place
};

export type TextTypography = FontId & {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: TextFontStyle;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
};

export type FontId = {
  fontId?: string;
  fontVariantId?: string;
};

export type TypographyStyle = {
  name: string;
  textStyle: TextStyle;
  typography: Typography;
};
