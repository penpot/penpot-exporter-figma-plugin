import { overrides, swappedInstances } from '@plugin/libraries';

import type { SyncGroups } from '@ui/lib/types/utils/syncGroups';

type SyncAttribute = SyncGroups[] | ((node: SceneNode) => SyncGroups[]);

type SyncAttributes = {
  [key in NodeChangeProperty]: SyncAttribute;
};

const getLayoutMode = (node: BaseNode | null): AutoLayoutMixin['layoutMode'] | undefined => {
  if (node && 'layoutMode' in node) {
    return node.layoutMode;
  }
};

// Figma names sizing by axis (primary/counter) and Penpot by direction (h/v): sizing
// modes depend on the node's own layout, child attributes on the parent's layout
const primaryAxisSizing = (node: BaseNode | null): SyncGroups =>
  getLayoutMode(node) === 'VERTICAL' ? 'layout-item-v-sizing' : 'layout-item-h-sizing';

const counterAxisSizing = (node: BaseNode | null): SyncGroups =>
  getLayoutMode(node) === 'VERTICAL' ? 'layout-item-h-sizing' : 'layout-item-v-sizing';

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
  styledTextSegments: ['text-content-structure', 'content-group'],
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
  layoutAlign: node => ['layout-item-align-self', counterAxisSizing(node.parent)],
  itemSpacing: ['layout-gap'],
  paddingLeft: ['layout-padding'],
  paddingTop: ['layout-padding'],
  paddingRight: ['layout-padding'],
  paddingBottom: ['layout-padding'],
  // layoutGrids are the guides (grids-group). The grid layout groups were mapped here
  // before and are kept, as dropping a touched group can make Penpot reset values
  layoutGrids: [
    'grids-group',
    'layout-grid-cells',
    'layout-grid-columns',
    'layout-grid-dir',
    'layout-grid-rows'
  ],
  layoutWrap: ['layout-wrap-type'],
  overflowDirection: ['layout-item-align-self'],
  counterAxisSizingMode: node => [counterAxisSizing(node)],
  primaryAxisSizingMode: node => [primaryAxisSizing(node)],
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
  layoutGrow: node => [primaryAxisSizing(node.parent)],
  layoutPositioning: ['layout-item-absolute'],
  itemReverseZIndex: ['layout-item-z-index'],
  parent: [],
  componentPropertyDefinitions: [],
  componentPropertyReferences: [],
  counterAxisSpacing: ['layout-gap'],
  counterAxisAlignContent: ['layout-align-content', 'layout-gap'],

  // @TODO: not supported yet
  hangingList: [],
  hangingPunctuation: [],
  textTruncation: [],
  maxLines: [],
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

const isPathNode = (node: SceneNode): boolean => {
  return (
    node.type === 'VECTOR' ||
    node.type === 'LINE' ||
    node.type === 'STAR' ||
    node.type === 'POLYGON'
  );
};

export const translateTouched = (node: SceneNode): SyncGroups[] => {
  const syncGroups: Set<SyncGroups> = new Set();

  const mainOverrides = overrides.get(node.id) ?? [];

  mainOverrides.forEach(override => {
    const syncAttribute = syncAttributes[override];
    const syncGroup = typeof syncAttribute === 'function' ? syncAttribute(node) : syncAttribute;

    syncGroup?.forEach(group => syncGroups.add(group));
  });

  const instanceOverrides = getInstanceOverrides(node);

  if (
    instanceOverrides &&
    (instanceOverrides.includes('width') || instanceOverrides.includes('height'))
  ) {
    syncGroups.add('geometry-group');
  }

  // Path content holds the shape geometry (and its corner rounding), so Penpot
  // considers it geometric too and would reset it from the main component
  if (isPathNode(node) && (syncGroups.has('geometry-group') || syncGroups.has('radius-group'))) {
    syncGroups.add('content-group');
  }

  const swapSlot = swappedInstances.get(node.id);

  if (swapSlot) {
    syncGroups.add(`swap-slot-${swapSlot}`);
  }

  return Array.from(syncGroups);
};
