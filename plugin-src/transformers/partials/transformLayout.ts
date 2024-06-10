import {
  translateLayoutFlexDir,
  translateLayoutGap,
  translateLayoutJustifyContent,
  translateLayoutJustifyItems,
  translateLayoutPadding,
  translateLayoutWrapType
} from '@plugin/translators';

import { LayoutAttributes } from '@ui/lib/types/shapes/layout';

export const transformAutoLayout = (node: BaseFrameMixin): LayoutAttributes => {
  console.log(node);
  return {
    layout: node.layoutMode !== 'NONE' ? 'flex' : undefined,
    layoutFlexDir: translateLayoutFlexDir(node.layoutMode),
    layoutGap: translateLayoutGap(node.layoutMode, node.itemSpacing),
    layoutWrapType: translateLayoutWrapType(node.layoutWrap),
    layoutPadding: translateLayoutPadding(node),
    layoutJustifyContent: translateLayoutJustifyContent(node),
    layoutJustifyItems: translateLayoutJustifyItems(node),
    layoutAlignContent: translateLayoutJustifyContent(node),
    layoutAlignItems: translateLayoutJustifyItems(node)
  };
};
