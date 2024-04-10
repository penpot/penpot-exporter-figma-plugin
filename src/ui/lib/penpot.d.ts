/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircleShape } from './types/circle/circleShape';
import { TextShape } from './types/text/textShape';

export interface PenpotFile {
  asMap(): any;
  export(): void;
  addPage(name: string, options?: object): void;
  closePage(): void;
  addArtboard(artboard: any): void;
  closeArtboard(): void;
  addGroup(group: any): void;
  closeGroup(): void;
  createRect(rect: any): void;
  createCircle(circle: CircleShape): void;
  createText(options: TextShape): void;
  createImage(image: any): void;
}

export function createFile(name: string): PenpotFile;
