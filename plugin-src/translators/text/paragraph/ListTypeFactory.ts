import { ListType } from './ListType';
import { OrderedListType } from './OrderedListType';
import { UnorderedListType } from './UnorderedListType';

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
