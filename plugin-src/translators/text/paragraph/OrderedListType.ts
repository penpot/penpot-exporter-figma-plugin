import * as romans from 'romans';

import { ListType } from './ListType';

export class OrderedListType implements ListType {
  public getCurrentSymbol(number: number, indentation: number): string {
    switch (indentation % 3) {
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
}
