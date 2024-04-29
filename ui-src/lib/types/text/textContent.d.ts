import { Fill } from '@ui/lib/types/utils/fill';

export type TextContent = {
  type: 'root';
  key?: string;
  verticalAlign?: TextVerticalAlign;
  children?: ParagraphSet[];
};

export type TextVerticalAlign = 'top' | 'bottom' | 'center';
export type TextHorizontalAlign = 'left' | 'right' | 'center' | 'justify';
export type TextFontStyle = 'normal' | 'italic';

type ParagraphSet = {
  type: 'paragraph-set';
  key?: string;
  children: Paragraph[];
};

type Paragraph = {
  type: 'paragraph';
  key?: string;
  children: TextNode[];
} & TextStyle;

type TextNode = {
  text: string;
  key?: string;
} & TextStyle;

type TextStyle = {
  fontId?: string;
  fontFamily?: string;
  fontVariantId?: string;
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
