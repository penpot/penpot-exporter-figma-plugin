import { PenpotPageOptions } from '@ui/lib/types/penpotPage';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { TextShape } from '@ui/lib/types/shapes/textShape';

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
  // addLibraryColor(color: any): void;
  // updateLibraryColor(color: any): void;
  // deleteLibraryColor(color: any): void;
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
