import { Uuid } from '../uuid';
import { ActionType } from './actionType';
import { Animation } from './animation';
import { EventType } from './eventType';
import { OverlayPositioningType } from './overlayPositioningType';

export type Interaction = {
  eventType: EventType;
  actionType: ActionType;
  destination?: Uuid;
  preserveScroll?: boolean;
  animation?: Animation;
  overlayPosition?: { x: number; y: number };
  overlayPosType?: OverlayPositioningType;
  closeClickOutside?: boolean;
  backgroundOverlay?: boolean;
  positionRelativeTo?: Uuid;
  url?: string;
  delay?: number;
};
