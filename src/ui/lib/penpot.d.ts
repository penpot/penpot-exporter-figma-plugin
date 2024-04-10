import { CircleShape } from './types/circle/circleShape';
import { FrameShape } from './types/frame/frameShape';
import { GroupShape } from './types/group/groupShape';
import { ImageShape } from './types/image/imageShape';
import { RectShape } from './types/rect/rectShape';
import { TextShape } from './types/text/textShape';

export interface PenpotFile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPage(name: string, options?: any): void;
  closePage(): void;
  addArtboard(artboard: FrameShape): void;
  closeArtboard(): void;
  addGroup(group: GroupShape): void;
  closeGroup(): void;
  // addBool(bool: any): void;
  // closeBool(): void;
  createRect(rect: RectShape): void;
  createCircle(circle: CircleShape): void;
  // createPath(path: any): void;
  createText(options: TextShape): void;
  createImage(image: ImageShape): void;
  // createSVG(svg: any): void;
  // closeSVG(): void;
  // addLibraryColor(color: any): void;
  // updateLibraryColor(color: any): void;
  // deleteLibraryColor(color: any): void;
  // addLibraryMedia(media: any): void;
  // deleteLibraryMedia(media: any): void;
  // addLibraryTypography(typography: any): void;
  // deleteLibraryTypography(typography: any): void;
  // startComponent(component: any): void;
  // finishComponent(): void;
  // createComponentInstance(instance: any): void;
  // lookupShape(shapeId: string): void;
  // updateObject(id: string, object: any): void;
  // deleteObject(id: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asMap(): any;
  export(): void;
}

export function createFile(name: string): PenpotFile;
