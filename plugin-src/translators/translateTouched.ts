import { componentProperties } from '@plugin/libraries';

import { SyncGroups } from '@ui/lib/types/utils/syncGroups';

type SyncAttributes = {
  [key in NodeChangeProperty]: SyncGroups[];
};

const syncAttributes: SyncAttributes = {
  name: [':name-group'],
  fills: [':fill-group'],
  backgrounds: [':fill-group'],
  fillStyleId: [':fill-group'],
  backgroundStyleId: [':fill-group'],
  textBackground: [':fill-group'],
  visible: [':visibility-group'],
  locked: [':modifiable-group'],
  fontName: [':text-font-group', ':content-group'],
  fontSize: [':text-font-group', ':content-group'],
  textCase: [':text-font-group', ':content-group'],
  textDecoration: [':text-font-group', ':content-group'],
  textStyleId: [':text-font-group', ':content-group'],
  characters: [':text-display-group', ':content-group'],
  styledTextSegments: [':text-display-group', ':content-group'],
  lineHeight: [':text-display-group', ':content-group'],
  leadingTrim: [':text-display-group', ':content-group'],
  paragraphIndent: [':text-display-group', ':content-group'],
  paragraphSpacing: [':text-display-group', ':content-group'],
  listSpacing: [':text-display-group', ':content-group'],
  hangingPunctuation: [':text-display-group', ':content-group'],
  hangingList: [':text-display-group', ':content-group'],
  letterSpacing: [':text-display-group', ':content-group'],
  textAlignHorizontal: [':text-display-group', ':content-group'],
  textAlignVertical: [':text-display-group', ':content-group'],
  textAutoResize: [':text-display-group', ':content-group'],
  text: [':text-display-group', ':content-group'],
  strokes: [':stroke-group'],
  strokeWeight: [':stroke-group'],
  strokeAlign: [':stroke-group'],
  strokeCap: [':stroke-group'],
  strokeJoin: [':stroke-group'],
  strokeMiterLimit: [':stroke-group'],
  dashPattern: [':stroke-group'],
  strokeStyleId: [':stroke-group'],
  stokeTopWeight: [':stroke-group'],
  strokeBottomWeight: [':stroke-group'],
  strokeLeftWeight: [':stroke-group'],
  strokeRightWeight: [':stroke-group'],
  connectorStartStrokeCap: [':stroke-group'],
  connectorEndStrokeCap: [':stroke-group'],
  innerRadius: [':radius-group'],
  topLeftRadius: [':radius-group'],
  topRightRadius: [':radius-group'],
  bottomLeftRadius: [':radius-group'],
  bottomRightRadius: [':radius-group'],
  cornerRadius: [':radius-group'],
  cornerSmoothing: [':radius-group'],
  vectorNetwork: [':geometry-group'],
  pointCount: [':geometry-group'],
  width: [':geometry-group'],
  height: [':geometry-group'],
  guides: [':geometry-group'],
  arcData: [':geometry-group'],
  constrainProportions: [':geometry-group'],
  handleMirroring: [':geometry-group'],
  relativeTransform: [':geometry-group'],
  x: [':geometry-group'],
  y: [':geometry-group'],
  rotation: [':geometry-group'],
  type: [':geometry-group'],
  shapeType: [':geometry-group'],
  connectorStart: [':geometry-group'],
  connectorEnd: [':geometry-group'],
  connectorLineType: [':geometry-group'],
  opacity: [':layer-effects-group'],
  blendMode: [':layer-effects-group'],
  effects: [':shadow-group', ':blur-group'],
  effectStyleId: [':shadow-group', ':blur-group'],
  isMask: [':mask-group'],
  clipsContent: [':mask-group'],
  maskType: [':mask-group'],
  constraints: [':constraints-group'],
  booleanOperation: [':bool-group'],
  exportSettings: [':exports-group'],
  gridStyleId: [':grids-group'],
  layoutMode: [':layout-container', ':layout-flex-dir'],
  layoutAlign: [':layout-align-content', ':layout-align-items'],
  itemSpacing: [':layout-gap'],
  paddingLeft: [':layout-padding'],
  paddingTop: [':layout-padding'],
  paddingRight: [':layout-padding'],
  paddingBottom: [':layout-padding'],
  layoutGrids: [
    ':layout-grid-cells',
    ':layout-grid-columns',
    ':layout-grid-dir',
    ':layout-grid-rows'
  ],
  layoutWrap: [':layout-wrap-type'],
  overflowDirection: [':layout-item-align-self'],
  counterAxisSizingMode: [':layout-item-h-sizing'],
  primaryAxisSizingMode: [':layout-item-v-sizing'],
  primaryAxisAlignItems: [
    ':layout-item-align-self',
    ':layout-justify-items',
    ':layout-justify-content',
    ':layout-gap'
  ],
  counterAxisAlignItems: [
    ':layout-item-align-self',
    ':layout-align-content',
    ':layout-align-items'
  ],
  layoutGrow: [':layout-item-h-sizing'],
  layoutPositioning: [':layout-item-absolute'],
  itemReverseZIndex: [':layout-item-z-index'],

  // @TODO: not supported yet
  textTruncation: [],
  minWidth: [],
  minHeight: [],
  maxWidth: [],
  maxHeight: [],
  maxLines: [],
  counterAxisSpacing: [],
  counterAxisAlignContent: [],
  openTypeFeatures: [],
  authorVisible: [],
  parent: [],
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
  componentPropertyDefinitions: [],
  componentPropertyReferences: [],
  componentProperties: [],
  embedData: [],
  linkUnfurlData: [],
  authorName: [],
  code: []
};

export const translateTouched = (
  changedProperties: NodeChangeProperty[] | undefined
): SyncGroups[] => {
  const syncGroups: Set<SyncGroups> = new Set();

  if (!changedProperties) return [];

  changedProperties.forEach(changedProperty => {
    const syncGroup = syncAttributes[changedProperty];

    if (syncGroup && syncGroup.length > 0) {
      syncGroup.forEach(group => syncGroups.add(group));
    }
  });

  return Array.from(syncGroups);
};
