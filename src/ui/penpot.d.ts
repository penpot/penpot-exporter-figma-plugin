/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PenpotFile {
  asMap(): any;
  export(): void;
  addPage(name: string): void;
  closePage(): void;
  addArtboard(artboard: any): void;
  closeArtboard(): void;
  addGroup(group: any): void;
  closeGroup(): void;
  createRect(rect: any): void;
  createCircle(circle: any): void;
  createText(text: any): void;
  createImage(image: any): void;
}

export function createFile(name: string): PenpotFile;
