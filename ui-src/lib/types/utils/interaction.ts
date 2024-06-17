import { Animation } from './animation';
import { Point } from './point';
import { Uuid } from './uuid';

export type Interaction =
  | InteractionNavigate
  | InteractionOpenOverlay
  | InteractionToggleOverlay
  | InteractionCloseOverlay
  | InteractionPrevScreen
  | InteractionOpenUrl;

type EventType =
  | 'click'
  | 'mouse-press'
  | 'mouse-over'
  | 'mouse-enter'
  | 'mouse-leave'
  | 'after-delay';

type OverlayPosType =
  | 'manual'
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

type InteractionNavigate = {
  'action-type': 'navigate';
  'event-type': EventType;
  'destination'?: Uuid;
  'preserve-scroll'?: boolean;
  'animation'?: Animation;
};

type InteractionOpenOverlay = {
  'action-type': 'open-overlay';
  'event-type': EventType;
  'overlay-position'?: Point;
  'overlay-pos-type'?: OverlayPosType;
  'destination'?: Uuid;
  'close-click-outside'?: boolean;
  'background-overlay'?: boolean;
  'animation'?: Animation;
  'position-relative-to'?: Uuid;
};

type InteractionToggleOverlay = {
  'action-type': 'toggle-overlay';
  'event-type': EventType;
  'overlay-position'?: Point;
  'overlay-pos-type'?: OverlayPosType;
  'destination'?: Uuid;
  'close-click-outside'?: boolean;
  'background-overlay'?: boolean;
  'animation'?: Animation;
  'position-relative-to'?: Uuid;
};

type InteractionCloseOverlay = {
  'action-type': 'close-overlay';
  'event-type': EventType;
  'destination'?: Uuid;
  'animation'?: Animation;
  'position-relative-to'?: Uuid;
};

type InteractionPrevScreen = {
  'action-type': 'prev-screen';
  'event-type': EventType;
};

type InteractionOpenUrl = {
  'action-type': 'open-url';
  'event-type': EventType;
  'url': string;
};
