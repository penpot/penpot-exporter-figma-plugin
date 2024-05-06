import * as romans from 'romans';

import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { List } from './List';
import { StyleTextSegment } from './translateParagraphProperties';

export class OrderedList implements List {
  private styles: (PenpotTextNode | undefined)[] = [];
  private counter: number[] = [];
  private indentation = 0;

  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    this.updateStyles(textNode, segment);
    this.updateCounter(segment);
    this.indentation = segment.indentation;

    return this.updateCurrentSymbol(this.getCurrentSymbol(), this.currentStyle(textNode, segment));
  }

  public restart(): void {
    this.styles = [];
    this.counter = [];
    this.indentation = 0;
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
    if (this.counter.length % 3 === 0) {
      return romans.romanize(number).toLowerCase();
    } else if (this.counter.length % 3 === 1) {
      return number.toString();
    } else {
      return this.letterOrderedList(number);
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

  private updateStyles(textNode: PenpotTextNode, segment: StyleTextSegment): void {
    if (segment.indentation > this.indentation) {
      for (let i = 0; i < segment.indentation - this.indentation; i++) {
        this.styles.push(undefined);
      }
    } else if (segment.indentation < this.indentation) {
      const elementsToRemove = this.indentation - segment.indentation;
      this.styles.splice(this.styles.length - elementsToRemove, elementsToRemove);
    }

    if (this.styles[this.styles.length - 1] === undefined) {
      this.styles[this.styles.length - 1] = this.createStyle(textNode, segment.indentation);
    }
  }

  private currentStyle(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    return this.styles[this.styles.length - 1] ?? this.createStyle(textNode, segment.indentation);
  }

  private createStyle(node: PenpotTextNode, indentation: number): PenpotTextNode {
    return {
      ...node,
      text: `${'\t'.repeat(Math.max(0, indentation - 1))}{currentSymbol}. `
    };
  }

  private updateCurrentSymbol(character: string, currentStyle: PenpotTextNode): PenpotTextNode {
    return {
      ...currentStyle,
      text: currentStyle.text.replace('{currentSymbol}', character)
    };
  }
}
