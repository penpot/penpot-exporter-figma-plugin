import { TypographyStyle } from '@ui/lib/types/shapes/textShape';

class UiTextLibraries {
  private libraries: Map<string, TypographyStyle> = new Map();

  public register(id: string, textStyle: TypographyStyle) {
    this.libraries.set(id, textStyle);
  }

  public get(id: string): TypographyStyle | undefined {
    return this.libraries.get(id);
  }

  public all(): TypographyStyle[] {
    return Array.from(this.libraries.values());
  }
}

export const uiTextLibraries = new UiTextLibraries();
