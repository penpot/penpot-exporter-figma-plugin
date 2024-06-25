class PaintStyles {
  private styles: Map<string, PaintStyle | undefined> = new Map();

  public register(id: string, styles?: PaintStyle | undefined) {
    this.styles.set(id, styles);
  }

  public get(id: string): PaintStyle | undefined {
    return this.styles.get(id);
  }

  public has(id: string): boolean {
    return this.styles.has(id);
  }

  public all(): Record<string, PaintStyle | undefined> {
    return Object.fromEntries(this.styles.entries());
  }
}

export const paintStyles = new PaintStyles();
