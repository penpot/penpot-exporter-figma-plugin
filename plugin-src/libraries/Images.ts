class Images {
  private images: Map<string, Image | null> = new Map();

  public register(hash: string, image: Image | null) {
    this.images.set(hash, image);
  }

  public get(hash: string): Image | null | undefined {
    return this.images.get(hash);
  }

  public has(hash: string): boolean {
    return this.images.has(hash);
  }

  public all(): Record<string, Image | null> {
    return Object.fromEntries(this.images.entries());
  }

  public init(images: Record<string, Image | null>): void {
    this.images = new Map(Object.entries(images));
  }
}

export const images = new Images();
