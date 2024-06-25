class TextStyles {
  private styles: Map<string, TextStyle | undefined> = new Map();

  public register(id: string, styles?: TextStyle | undefined) {
    this.styles.set(id, styles);
  }

  public get(id: string): TextStyle | undefined {
    return this.styles.get(id);
  }

  public has(id: string): boolean {
    return this.styles.has(id);
  }

  public all(): Record<string, TextStyle | undefined> {
    return Object.fromEntries(this.styles.entries());
  }
}

export const textStyles = new TextStyles();
