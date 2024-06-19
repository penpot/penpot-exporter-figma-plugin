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
    return Object.fromEntries(this.styles.entries());
  }

  public init(styles: Record<string, Fill[]>): void {
    this.styles = new Map(Object.entries(styles));
  }
}

export const styleLibrary = new StyleLibrary();
