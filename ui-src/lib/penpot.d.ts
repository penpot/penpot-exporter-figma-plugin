import { BoolShape } from '@ui/lib/types/bool/boolShape';
import { CircleShape } from '@ui/lib/types/circle/circleShape';
import { FrameShape } from '@ui/lib/types/frame/frameShape';
import { GroupShape } from '@ui/lib/types/group/groupShape';
import { ImageShape } from '@ui/lib/types/image/imageShape';
import { PathShape } from '@ui/lib/types/path/pathShape';
import { PenpotPageOptions } from '@ui/lib/types/penpotPage';
import { RectShape } from '@ui/lib/types/rect/rectShape';
import { TextShape } from '@ui/lib/types/text/textShape';

export interface PenpotFile {
  addPage(name: string, options?: PenpotPageOptions): void;
  closePage(): void;
  addArtboard(artboard: FrameShape): void;
  closeArtboard(): void;
  addGroup(group: GroupShape): void;
  closeGroup(): void;
  addBool(bool: BoolShape): void;
  closeBool(): void;
  createRect(rect: RectShape): void;
  createCircle(circle: CircleShape): void;
  createPath(path: PathShape): void;
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
  asMap(): unknown;
  export(): void;
}

export function createFile(name: string): PenpotFile;
