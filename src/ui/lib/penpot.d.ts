import { CircleShape } from './types/circle/circleShape';
import { GroupShape } from './types/group/groupShape';
import { ImageShape } from './types/image/imageShape';
import { RectShape } from './types/rect/rectShape';
import { TextShape } from './types/text/textShape';

export interface PenpotFile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asMap(): any;
  export(): void;
  addPage(name: string, options?: object): void;
  closePage(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addArtboard(artboard: any): void;
  closeArtboard(): void;
  addGroup(group: GroupShape): void;
  closeGroup(): void;
  createRect(rect: RectShape): void;
  createCircle(circle: CircleShape): void;
  createText(options: TextShape): void;
  createImage(image: ImageShape): void;
}

export function createFile(name: string): PenpotFile;
