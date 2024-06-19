import { Fill } from '@ui/lib/types/utils/fill';

class StyleLibrary {
  private styles: Map<string, Fill[]> = new Map();

  public register(id: string, styles: Fill[]) {
    this.styles.set(id, styles);
  }

  public get(id: string): Fill[] | undefined {
    return this.styles.get(id);
  }

  public has(id: string): boolean {
    return this.styles.has(id);
  }

  public all(): Record<string, Fill[]> {
    const styles: Record<string, Fill[]> = {};

    for (const [id, fills] of this.styles) {
      styles[id] = fills;
    }

    return styles;
  }

  public init(styles: Record<string, Fill[]>): void {
    for (const [id, fills] of Object.entries(styles)) {
      this.register(id, fills);
    }
  }
}

export const styleLibrary = new StyleLibrary();
