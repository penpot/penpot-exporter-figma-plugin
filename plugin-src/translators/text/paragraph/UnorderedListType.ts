import { ListType } from './ListType';

export class UnorderedListType implements ListType {
  public getCurrentSymbol(_number: number, _indentation: number): string {
    return ' •  ';
  }
}
