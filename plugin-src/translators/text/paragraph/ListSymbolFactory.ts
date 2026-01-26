import type { ListSymbol } from '@plugin/translators/text/paragraph/ListSymbol';
import { OrderedListSymbol } from '@plugin/translators/text/paragraph/OrderedListSymbol';
import { UnorderedListSymbol } from '@plugin/translators/text/paragraph/UnorderedListSymbol';
import type { ListType } from '@plugin/translators/text/paragraph/getListType';

export class ListSymbolFactory {
  private unorderedList = new UnorderedListSymbol();
  private orderedList = new OrderedListSymbol();

  public getList(listType: ListType): ListSymbol {
    switch (listType) {
      case 'ORDERED':
        return this.orderedList;
      case 'UNORDERED':
        return this.unorderedList;
    }

    throw new Error('List type not valid');
  }
}
