import { overrides } from '@plugin/libraries';

import type { SyncGroups } from '@ui/lib/types/utils/syncGroups';

type SyncAttributes = {
  [key in NodeChangeProperty]: SyncGroups[];
};

const syncAttributes: SyncAttributes = {
  name: ['name-group'],
  fills: ['fill-group'],
  backgrounds: ['fill-group'],
  fillStyleId: ['fill-group'],
  backgroundStyleId: ['fill-group'],
  textBackground: ['fill-group'],
  visible: ['visibility-group'],
  locked: ['modifiable-group'],
  fontName: ['text-content-attribute', 'content-group'],
  fontSize: ['text-content-attribute', 'content-group'],
  textCase: ['text-content-attribute', 'content-group'],
  textDecoration: ['text-content-attribute', 'content-group'],
  textStyleId: ['text-content-attribute', 'content-group'],
  characters: ['text-content-text', 'content-group'],
  styledTextSegments: ['text-content-structure'],
  lineHeight: ['text-content-attribute', 'content-group'],
  leadingTrim: ['text-font-group'],
  paragraphIndent: ['text-content-attribute', 'content-group'],
  paragraphSpacing: ['text-content-attribute', 'content-group'],
  listSpacing: ['text-content-attribute', 'content-group'],
  letterSpacing: ['text-content-attribute', 'content-group'],
  textAlignHorizontal: ['text-content-attribute', 'content-group'],
  textAlignVertical: ['text-content-attribute', 'content-group'],
  textAutoResize: ['text-font-group'],
  text: ['text-content-text', 'content-group'],
  strokes: ['stroke-group'],
  strokeWeight: ['stroke-group'],
  strokeAlign: ['stroke-group'],
  strokeCap: ['stroke-group'],
  strokeJoin: ['stroke-group'],
  strokeMiterLimit: ['stroke-group'],
  dashPattern: ['stroke-group'],
  strokeStyleId: ['stroke-group'],
  stokeTopWeight: ['stroke-group'],
  strokeBottomWeight: ['stroke-group'],
  strokeLeftWeight: ['stroke-group'],
  strokeRightWeight: ['stroke-group'],
  connectorStartStrokeCap: ['stroke-group'],
  connectorEndStrokeCap: ['stroke-group'],
  innerRadius: ['radius-group'],
  topLeftRadius: ['radius-group'],
  topRightRadius: ['radius-group'],
  bottomLeftRadius: ['radius-group'],
  bottomRightRadius: ['radius-group'],
  cornerRadius: ['radius-group'],
  cornerSmoothing: ['radius-group'],
  vectorNetwork: ['geometry-group'],
  pointCount: ['geometry-group'],
  width: ['geometry-group'],
  height: ['geometry-group'],
  guides: ['geometry-group'],
  arcData: ['geometry-group'],
  constrainProportions: ['geometry-group'],
  handleMirroring: ['geometry-group'],
  relativeTransform: ['geometry-group'],
  x: ['geometry-group'],
  y: ['geometry-group'],
  rotation: ['geometry-group'],
  type: ['geometry-group'],
  shapeType: ['geometry-group'],
  connectorStart: ['geometry-group'],
  connectorEnd: ['geometry-group'],
  connectorLineType: ['geometry-group'],
  opacity: ['layer-effects-group'],
  blendMode: ['layer-effects-group'],
  effects: ['shadow-group', 'blur-group'],
  effectStyleId: ['shadow-group', 'blur-group'],
  isMask: ['mask-group'],
  maskType: ['mask-group'],
  constraints: ['constraints-group'],
  booleanOperation: ['content-group'],
  clipsContent: ['show-content'],
  exportSettings: ['exports-group'],
  gridStyleId: ['grids-group'],
  layoutMode: ['layout-container', 'layout-flex-dir'],
  layoutAlign: ['layout-align-content', 'layout-align-items'],
  itemSpacing: ['layout-gap'],
  paddingLeft: ['layout-padding'],
  paddingTop: ['layout-padding'],
  paddingRight: ['layout-padding'],
  paddingBottom: ['layout-padding'],
  layoutGrids: ['layout-grid-cells', 'layout-grid-columns', 'layout-grid-dir', 'layout-grid-rows'],
  layoutWrap: ['layout-wrap-type'],
  overflowDirection: ['layout-item-align-self'],
  counterAxisSizingMode: ['layout-item-h-sizing'],
  primaryAxisSizingMode: ['layout-item-v-sizing'],
  maxHeight: ['layout-item-max-h'],
  minHeight: ['layout-item-min-h'],
  maxWidth: ['layout-item-max-w'],
  minWidth: ['layout-item-min-w'],
  primaryAxisAlignItems: [
    'layout-item-align-self',
    'layout-justify-items',
    'layout-justify-content',
    'layout-gap'
  ],
  counterAxisAlignItems: ['layout-item-align-self', 'layout-align-content', 'layout-align-items'],
  layoutGrow: ['layout-item-h-sizing'],
  layoutPositioning: ['layout-item-absolute'],
  itemReverseZIndex: ['layout-item-z-index'],
  parent: [],
  componentPropertyDefinitions: [],
  componentPropertyReferences: [],

  // @TODO: not supported yet
  hangingList: [],
  hangingPunctuation: [],
  textTruncation: [],
  maxLines: [],
  counterAxisSpacing: [],
  counterAxisAlignContent: [],
  openTypeFeatures: [],
  authorVisible: [],
  pluginData: [],
  autoRename: [],
  overlayPositionType: [],
  overlayBackgroundInteraction: [],
  overlayBackground: [],
  prototypeStartNode: [],
  prototypeBackgrounds: [],
  expanded: [],
  description: [],
  hyperlink: [],
  mediaData: [],
  reactions: [],
  flowStartingPoints: [],
  codeLanguage: [],
  widgetSyncedState: [],
  componentProperties: [],
  embedData: [],
  linkUnfurlData: [],
  authorName: [],
  code: []
};

const getInstanceId = (node: SceneNode): string | undefined => {
  const ids = node.id.split(';');

  if (ids.length > 1) {
    return ids[0].replace('I', '');
  }
};

const getInstanceOverrides = (node: SceneNode): NodeChangeProperty[] | undefined => {
  const instanceId = getInstanceId(node);

  if (instanceId && overrides.has(instanceId)) {
    return overrides.get(instanceId);
  }
};

export const translateTouched = (node: SceneNode): SyncGroups[] => {
  const syncGroups: Set<SyncGroups> = new Set();

  const mainOverrides = overrides.get(node.id) ?? [];

  mainOverrides.forEach(override => {
    const syncGroup = syncAttributes[override];
    if (syncGroup && syncGroup.length > 0) {
      syncGroup.forEach(group => syncGroups.add(group));
    }
  });

  const instanceOverrides = getInstanceOverrides(node);

  if (instanceOverrides && instanceOverrides.length > 0) {
    if (instanceOverrides.includes('width')) {
      syncGroups.add('geometry-group');
    }

    if (instanceOverrides.includes('height')) {
      syncGroups.add('geometry-group');
    }
  }

  return Array.from(syncGroups);
};
