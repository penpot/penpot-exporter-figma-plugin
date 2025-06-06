import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotPage } from '@ui/lib/types/penpotPage';
import { PenpotBool } from '@ui/lib/types/shapes/boolShape';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { PenpotComponent } from '@ui/lib/types/shapes/componentShape';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { Color } from '@ui/lib/types/utils/color';
import { ImageColor } from '@ui/lib/types/utils/imageColor';
import { Media } from '@ui/lib/types/utils/media';
import { Typography } from '@ui/lib/types/utils/typography';
import { Uuid } from '@ui/lib/types/utils/uuid';

export interface PenpotContext {
  addFile(file: PenpotFile): Uuid;
  addPage(page: PenpotPage): Uuid;
  closePage(): void;
  addBoard(artboard: FrameShape): Uuid;
  closeBoard(): void;
  addGroup(group: GroupShape): Uuid;
  closeGroup(): void;
  addBool(bool: PenpotBool): Uuid;
  addRect(rect: RectShape): Uuid;
  addCircle(circle: CircleShape): Uuid;
  addPath(path: PathShape): Uuid;
  addText(options: TextShape): Uuid;
  addLibraryColor(color: Color): Uuid;
  addLibraryTypography(typography: Typography): Uuid;
  addComponent(component: PenpotComponent): Uuid;
  addFileMedia(media: Media, blob: Blob): Uuid;
  getMediaAsImage(mediaId: Uuid): ImageColor;
  genId(): Uuid;
  currentPageId: Uuid;
  currentFileId: Uuid;
  currentFrameId: Uuid;
}
