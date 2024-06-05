import { ImageColor } from '@ui/lib/types/utils/imageColor';

class UiImages {
  private images: Record<string, ImageColor> = {};

  public register(id: string, image: ImageColor) {
    this.images[id] = image;
  }

  public get(id: string): ImageColor | undefined {
    return this.images[id];
  }

  public all(): ImageColor[] {
    return Object.values(this.images);
  }

  public init() {
    this.images = {};
  }
}

export const uiImages = new UiImages();
