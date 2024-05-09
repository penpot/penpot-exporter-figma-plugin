import { PenpotFile } from '@ui/lib/penpot';
import {
  Paragraph,
  ParagraphSet,
  TextContent,
  TextNode,
  TextShape
} from '@ui/lib/types/shapes/textShape';
import { Fill } from '@ui/lib/types/utils/fill';
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
  if (!content) return content;

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
    fills: paragraph.fills
      ?.map(fill => removeImageFill(fill))
      .filter((fill): fill is Fill => !!fill),
    children: paragraph.children.map(child => fixTextNodeFills(child))
  };
};

const fixTextNodeFills = (textNode: TextNode): TextNode => {
  return {
    ...textNode,
    fills: textNode.fills?.map(fill => removeImageFill(fill)).filter((fill): fill is Fill => !!fill)
  };
};

const removeImageFill = ({ fillImage, ...rest }: Fill): Fill | undefined => {
  if (fillImage) {
    return {
      ...rest,
      fillColor: '#000000'
    };
  }
};
