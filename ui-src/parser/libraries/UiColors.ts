import { FillStyle } from '@ui/lib/types/utils/fill';

class UiColors {
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
}

export const uiColors = new UiColors();
