import { SyncGroups } from '@ui/lib/types/utils/syncGroups';

export type SyncAttributes = {
  [key in NodeChangeProperty]: SyncGroups;
};

export const syncAttributes: SyncAttributes = {
  name: ':name-group',
  fills: ':fill-group',
  backgrounds: ':fill-group',
  fillStyleId: ':fill-group',
  backgroundStyleId: ':fill-group',
  textBackground: ':fill-group',
  pointCount: ':geometry-group',
  width: ':geometry-group',
  height: ':geometry-group',
  locked: ':geometry-group',
  guides: ':geometry-group',
  vectorNetwork: ':geometry-group',
  arcData: ':geometry-group',
  constrainProportions: ':geometry-group',
  handleMirroring: ':geometry-group',
  relativeTransform: ':geometry-group',
  x: ':geometry-group',
  y: ':geometry-group',
  rotation: ':geometry-group',
  type: ':geometry-group',
  shapeType: ':geometry-group',
  connectorStart: ':geometry-group',
  connectorEnd: ':geometry-group',
  connectorLineType: ':geometry-group',
  constraints: ':constraints-group',
  visible: ':visibility-group',
  opacity: ':layer-effects-group',
  blendMode: ':layer-effects-group',
  effects: ':layer-effects-group',
  effectStyleId: ':layer-effects-group',
  layoutGrids: ':layout-grid-columns',
  characters: ':text-display-group',
  openTypeFeatures: ':text-font-group',
  styledTextSegments: ':text-display-group',
  exportSettings: ':exports-group',
  fontName: ':text-font-group',
  innerRadius: ':radius-group',
  fontSize: ':text-font-group',
  lineHeight: ':text-display-group',
  leadingTrim: ':text-display-group',
  paragraphIndent: ':text-display-group',
  paragraphSpacing: ':text-display-group',
  listSpacing: ':text-display-group',
  hangingPunctuation: ':text-display-group',
  hangingList: ':text-display-group',
  letterSpacing: ':text-display-group',
  textAlignHorizontal: ':text-display-group',
  textAlignVertical: ':text-display-group',
  textCase: ':text-font-group',
  textDecoration: ':text-font-group',
  textAutoResize: ':text-display-group',
  topLeftRadius: ':radius-group',
  topRightRadius: ':radius-group',
  bottomLeftRadius: ':radius-group',
  bottomRightRadius: ':radius-group',
  strokes: ':stroke-group',
  strokeWeight: ':stroke-group',
  strokeAlign: ':stroke-group',
  strokeCap: ':stroke-group',
  strokeJoin: ':stroke-group',
  strokeMiterLimit: ':stroke-group',
  booleanOperation: ':bool-group',
  overflowDirection: ':layout-item-align-self',
  dashPattern: ':stroke-group',
  cornerRadius: ':radius-group',
  cornerSmoothing: ':radius-group',
  isMask: ':mask-group',
  clipsContent: ':mask-group',
  strokeStyleId: ':stroke-group',
  textStyleId: ':text-font-group',
  gridStyleId: ':grids-group',
  layoutMode: ':layout-container',
  paddingLeft: ':layout-padding',
  paddingTop: ':layout-padding',
  paddingRight: ':layout-padding',
  paddingBottom: ':layout-padding',
  itemSpacing: ':layout-item-margin',
  layoutAlign: ':layout-item-align-self',
  counterAxisSizingMode: ':layout-item-h-sizing',
  primaryAxisSizingMode: ':layout-item-v-sizing',
  primaryAxisAlignItems: ':layout-item-align-self',
  counterAxisAlignItems: ':layout-item-align-self',
  layoutGrow: ':layout-item-h-sizing',
  layoutPositioning: ':layout-item-absolute',
  itemReverseZIndex: ':layout-item-z-index',
  stokeTopWeight: ':stroke-group',
  strokeBottomWeight: ':stroke-group',
  strokeLeftWeight: ':stroke-group',
  strokeRightWeight: ':stroke-group',
  connectorStartStrokeCap: ':stroke-group',
  connectorEndStrokeCap: ':stroke-group',
  text: ':text-display-group'
  // @TODO: not supported
  // authorVisible
  // parent
  // pluginData
  // autoRename
  // overlayPositionType
  // overlayBackgroundInteraction
  // overlayBackground
  // prototypeStartNode
  // prototypeBackgrounds
  // expanded
  // description
  // hyperlink
  // mediaData
  // reactions
  // flowStartingPoints
  // codeLanguage
  // widgetSyncedState
  // componentPropertyDefinitions
  // componentPropertyReferences
  // componentProperties
  // embedData: ':content-group',
  // linkUnfurlData: ':content-group',
  // authorName: ':content-group',
  // code: ':content-group',
};
