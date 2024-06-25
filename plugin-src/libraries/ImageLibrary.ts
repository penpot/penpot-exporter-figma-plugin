class ImageLibrary {
  private images: Record<string, Image | null> = {};

  public register(hash: string, image: Image | null) {
    this.images[hash] = image;
  }

  public get(hash: string): Image | null | undefined {
    return this.images[hash];
  }

  public all(): Record<string, Image | null> {
    return this.images;
  }

  public init(images: Record<string, Image | null>): void {
    this.images = images;
  }
}

export const imagesLibrary = new ImageLibrary();
