import { CircleShape } from './types/circle/circleShape';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addGroup(group: any): void;
  closeGroup(): void;
  createRect(rect: RectShape): void;
  createCircle(circle: CircleShape): void;
  createText(options: TextShape): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createImage(image: any): void;
}

export function createFile(name: string): PenpotFile;
