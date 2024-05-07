import * as romans from 'romans';

import { BaseList } from '@plugin/translators/text/paragraph/BaseList';

import { TextNode as PenpotTextNode, TextNode } from '@ui/lib/types/shapes/textShape';

import { StyleTextSegment } from './translateParagraphProperties';

export class OrderedList extends BaseList {
  protected counter: number[] = [];

  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    this.updateStyles(textNode, segment);
    this.updateCounter(segment);
    this.indentation = segment.indentation;

    return this.updateCurrentSymbol(this.getCurrentSymbol(), this.currentStyle(textNode, segment));
  }

  public restart(): void {
    this.styles = new Map();
    this.counter = [];
    this.indentation = 0;
  }

  protected createStyle(node: TextNode, indentation: number): TextNode {
    return super.createStyle(node, indentation, '{currentSymbol}. ');
  }

  private updateCounter(segment: StyleTextSegment): void {
    if (segment.indentation > this.indentation) {
      for (let i = 0; i < segment.indentation - this.indentation; i++) {
        this.counter.push(0);
      }
    } else {
      const elementsToRemove = this.indentation - segment.indentation;
      this.counter.splice(this.counter.length - elementsToRemove, elementsToRemove);
    }

    this.counter[this.counter.length - 1]++;
  }

  private getCurrentSymbol(): string {
    const number = this.counter[this.counter.length - 1];

    switch (this.counter.length % 3) {
      case 0:
        return romans.romanize(number).toLowerCase();
      case 2:
        return this.letterOrderedList(number);
      case 1:
      default:
        return number.toString();
    }
  }

  private letterOrderedList(number: number): string {
    let result = '';

    while (number > 0) {
      let letterCode = number % 26;

      if (letterCode === 0) {
        letterCode = 26;
        number = Math.floor(number / 26) - 1;
      } else {
        number = Math.floor(number / 26);
      }

      result = String.fromCharCode(letterCode + 96) + result;
    }

    return result;
  }

  private updateCurrentSymbol(character: string, currentStyle: PenpotTextNode): PenpotTextNode {
    return {
      ...currentStyle,
      text: currentStyle.text.replace('{currentSymbol}', character)
    };
  }
}