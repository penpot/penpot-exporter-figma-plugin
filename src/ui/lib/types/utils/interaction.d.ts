import { Animation } from './animation';
import { Uuid } from './uuid';

export type Interaction = {
  eventType: symbol; // 'click' | 'mouse-press' | 'mouse-over' | 'mouse-enter' | 'mouse-leave' | 'after-delay'
  actionType: symbol; // 'navigate' | 'open-overlay' | 'toggle-overlay' | 'close-overlay' | 'prev-screen' | 'open-url'
  destination?: Uuid;
  preserveScroll?: boolean;
  animation?: Animation;
  overlayPosition?: { x: number; y: number };
  overlayPosType?: symbol; // 'manual' | 'center' | 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'
  closeClickOutside?: boolean;
  backgroundOverlay?: boolean;
  positionRelativeTo?: Uuid;
  url?: string;
  delay?: number;
};
