import { ImageColor } from '@ui/lib/types/utils/imageColor';

class ImageLibrary {
  private images: Record<string, ImageColor> = {};

  public register(hash: string, image: ImageColor) {
    this.images[hash] = image;
  }

  public get(hash: string): ImageColor | undefined {
    return this.images[hash];
  }

  public all(): Record<string, ImageColor> {
    return this.images;
  }

  public init(images: Record<string, ImageColor>): void {
    this.images = images;
  }
}

export const imagesLibrary = new ImageLibrary();
