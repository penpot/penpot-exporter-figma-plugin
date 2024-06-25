import { ImageColor } from '@ui/lib/types/utils/imageColor';

class Images {
  private images: Map<string, ImageColor> = new Map();

  public register(id: string, image: ImageColor) {
    this.images.set(id, image);
  }

  public get(id: string): ImageColor | undefined {
    return this.images.get(id);
  }

  public all(): ImageColor[] {
    return Array.from(this.images.values());
  }

  public init() {
    this.images.clear();
  }
}

export const images = new Images();
