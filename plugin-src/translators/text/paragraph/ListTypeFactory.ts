import { ListType } from '@plugin/translators/text/paragraph/ListType';
import { OrderedListType } from '@plugin/translators/text/paragraph/OrderedListType';
import { UnorderedListType } from '@plugin/translators/text/paragraph/UnorderedListType';

export class ListTypeFactory {
  private unorderedList = new UnorderedListType();
  private orderedList = new OrderedListType();

  public getListType(textListOptions: TextListOptions): ListType {
    switch (textListOptions.type) {
      case 'ORDERED':
        return this.orderedList;
      case 'UNORDERED':
        return this.unorderedList;
    }

    throw new Error('List type not valid');
  }
}
