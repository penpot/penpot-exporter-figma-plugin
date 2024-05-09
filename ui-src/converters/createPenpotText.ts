import { PenpotFile } from '@ui/lib/penpot';
import {
  Paragraph,
  ParagraphSet,
  TextContent,
  TextNode,
  TextShape
} from '@ui/lib/types/shapes/textShape';
import { translateUiBlendMode } from '@ui/translators';

export const createPenpotText = (
  file: PenpotFile,
  { type, blendMode, content, ...rest }: TextShape
) => {
  file.createText({
    blendMode: translateUiBlendMode(blendMode),
    content: fixContentFills(content), //@TODO: fix text image fills
    ...rest
  });
};

const fixContentFills = (content?: TextContent): TextContent | undefined => {
  if (!content) return;

  return {
    ...content,
    children: content.children?.map(children => fixParagraphSetFills(children))
  };
};

const fixParagraphSetFills = (paragraphSet: ParagraphSet): ParagraphSet => {
  return {
    ...paragraphSet,
    children: paragraphSet.children.map(paragraph => fixParagraphFills(paragraph))
  };
};

const fixParagraphFills = (paragraph: Paragraph): Paragraph => {
  return {
    ...paragraph,
    fills: paragraph.fills?.filter(fill => fill.fillImage === undefined),
    children: paragraph.children.map(child => fixTextNodeFills(child))
  };
};

const fixTextNodeFills = (textNode: TextNode): TextNode => {
  return {
    ...textNode,
    fills: textNode.fills?.filter(fill => fill.fillImage === undefined)
  };
};
