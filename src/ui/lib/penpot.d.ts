import { CircleShape } from './types/circle/circleShape';
import { FrameShape } from './types/frame/frameShape';
import { GroupShape } from './types/group/groupShape';
import { ImageShape } from './types/image/imageShape';
import { RectShape } from './types/rect/rectShape';
import { TextShape } from './types/text/textShape';

export interface PenpotFile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asMap(): any;
  export(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPage(name: string, options?: any): void;
  closePage(): void;
  addArtboard(artboard: FrameShape): void;
  closeArtboard(): void;
  addGroup(group: GroupShape): void;
  closeGroup(): void;
  createRect(rect: RectShape): void;
  createCircle(circle: CircleShape): void;
  createText(options: TextShape): void;
  createImage(image: ImageShape): void;
}

export function createFile(name: string): PenpotFile;
