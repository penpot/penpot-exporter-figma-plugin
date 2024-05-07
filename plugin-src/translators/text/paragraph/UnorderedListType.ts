import { ListType } from './ListType';

export class UnorderedListType implements ListType {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getCurrentSymbol(_number: number, _indentation: number): string {
    return ' •  ';
  }
}
