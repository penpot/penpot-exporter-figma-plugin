import type { ListSymbol } from '@plugin/translators/text/paragraph/ListSymbol';

export class UnorderedListSymbol implements ListSymbol {
  public getCurrentSymbol(_number: number, _indentation: number): string {
    return ' •  ';
  }
}
