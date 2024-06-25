import { Uuid } from '@ui/lib/types/utils/uuid';

class Identifiers {
  private idMap: Map<string, Uuid> = new Map();

  public init() {
    this.idMap.clear();
  }

  public get(figmaId: string): Uuid | undefined {
    return this.idMap.get(figmaId);
  }

  public register(figmaId: string, id: Uuid) {
    this.idMap.set(figmaId, id);
  }
}

export const identifiers = new Identifiers();
