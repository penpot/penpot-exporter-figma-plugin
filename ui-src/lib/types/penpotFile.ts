import { PenpotPageOptions } from '@ui/lib/types/penpotPage';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { Color } from '@ui/lib/types/utils/color';
import { Typography } from '@ui/lib/types/utils/typography';
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
  addLibraryColor(color: Color): void;
  addLibraryTypography(typography: Typography): void;
  startComponent(component: ComponentShape): Uuid;
  finishComponent(): void;
  startDeletedComponent(component: ComponentShape): Uuid;
  finishDeletedComponent(): void;
  getId(): Uuid;
  getCurrentPageId(): Uuid;
  newId(): Uuid;
  export(): Promise<Blob>;
}
