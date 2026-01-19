import { ListSymbolFactory } from '@plugin/translators/text/paragraph/ListSymbolFactory';
import { type ListType, getListType } from '@plugin/translators/text/paragraph/getListType';
import type { TextSegment } from '@plugin/translators/text/paragraph/translateParagraphProperties';

import type { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

type Level = {
  style: PenpotTextNode;
  counter: number;
  type: ListType;
};

export class List {
  private levels: Map<number, Level> = new Map();
  private indentation = 0;
  protected counter: number[] = [];
  private listSymbolFactory = new ListSymbolFactory();

  public update(textNode: PenpotTextNode, segment: TextSegment): void {
    const listType = getListType(segment);

    if (segment.indentation < this.indentation) {
      for (let i = segment.indentation + 1; i <= this.indentation; i++) {
        this.levels.delete(i);
      }
    }

    let level = this.levels.get(segment.indentation);

    if (!level || level.type !== listType) {
      level = {
        style: this.createStyle(textNode, segment.indentation),
        counter: 0,
        type: listType
      };

      this.levels.set(segment.indentation, level);
    }

    level.counter++;
    this.indentation = segment.indentation;
  }

  public getCurrentList(textNode: PenpotTextNode, segment: TextSegment): PenpotTextNode {
    const level = this.levels.get(segment.indentation);
    if (level === undefined) {
      throw new Error('Levels not updated');
    }

    const listSymbol = this.listSymbolFactory.getList(getListType(segment));

    return this.updateCurrentSymbol(
      listSymbol.getCurrentSymbol(level.counter, segment.indentation),
      level.style
    );
  }

  private createStyle(node: PenpotTextNode, indentation: number): PenpotTextNode {
    return {
      ...node,
      text: `${'\t'.repeat(Math.max(0, indentation - 1))}{currentSymbol}`
    };
  }

  private updateCurrentSymbol(character: string, currentStyle: PenpotTextNode): PenpotTextNode {
    return {
      ...currentStyle,
      text: currentStyle.text.replace('{currentSymbol}', character)
    };
  }
}
