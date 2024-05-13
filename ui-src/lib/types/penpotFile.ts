import { PenpotPageOptions } from '@ui/lib/types/penpotPage';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { Uuid } from '@ui/lib/types/utils/uuid';

export interface PenpotFile {
  addPage(name: string, options?: PenpotPageOptions): Uuid;
  closePage(): void;
  addArtboard(artboard: FrameShape): Uuid;
  closeArtboard(): void;
  addGroup(group: GroupShape): Uuid;
  closeGroup(): void;
  addBool(bool: BoolShape): Uuid;
  closeBool(): void;
  createRect(rect: RectShape): Uuid;
  createCircle(circle: CircleShape): Uuid;
  createPath(path: PathShape): Uuid;
  createText(options: TextShape): Uuid;
  // addLibraryColor(color: any): void;
  // updateLibraryColor(color: any): void;
  // deleteLibraryColor(color: any): void;
  // addLibraryTypography(typography: any): void;
  // deleteLibraryTypography(typography: any): void;
  startComponent(component: ComponentShape): void;
  finishComponent(): void;
  // createComponentInstance(instance: any): void;
  // lookupShape(shapeId: string): void;
  // updateObject(id: string, object: any): void;
  // deleteObject(id: string): void;
  asMap(): unknown;
  export(): void;
}
