import { FillStyle } from '@ui/lib/types/utils/fill';

class UiColorLibraries {
  private libraries: Map<string, FillStyle> = new Map();

  public register(id: string, fillStyle: FillStyle) {
    this.libraries.set(id, fillStyle);
  }

  public get(id: string): FillStyle | undefined {
    return this.libraries.get(id);
  }

  public all(): FillStyle[] {
    return Array.from(this.libraries.values());
  }

  public init(libraries: Record<string, FillStyle>) {
    this.libraries = new Map(Object.entries(libraries));
  }
}

export const uiColorLibraries = new UiColorLibraries();
