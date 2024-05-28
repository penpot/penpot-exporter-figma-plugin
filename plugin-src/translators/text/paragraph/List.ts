import { StyleTextSegment } from '@plugin/translators/text/paragraph/translateParagraphProperties';

import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { ListTypeFactory } from './ListTypeFactory';

type Level = {
  style: PenpotTextNode;
  counter: number;
  type: ListType;
};

type ListType = 'ORDERED' | 'UNORDERED' | 'NONE';

export class List {
  private levels: Map<number, Level> = new Map();
  private indentation = 0;
  protected counter: number[] = [];
  private listTypeFactory = new ListTypeFactory();

  public update(textNode: PenpotTextNode, segment: StyleTextSegment): void {
    if (segment.indentation < this.indentation) {
      for (let i = segment.indentation + 1; i <= this.indentation; i++) {
        this.levels.delete(i);
      }
    }

    let level = this.levels.get(segment.indentation);

    if (!level || level.type !== segment.listOptions.type) {
      level = {
        style: this.createStyle(textNode, segment.indentation),
        counter: 0,
        type: segment.listOptions.type
      };

      this.levels.set(segment.indentation, level);
    }

    level.counter++;
    this.indentation = segment.indentation;
  }

  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    const level = this.levels.get(segment.indentation);
    if (level === undefined) {
      throw new Error('Levels not updated');
    }

    const listType = this.listTypeFactory.getListType(segment.listOptions);

    return this.updateCurrentSymbol(
      listType.getCurrentSymbol(level.counter, segment.indentation),
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
