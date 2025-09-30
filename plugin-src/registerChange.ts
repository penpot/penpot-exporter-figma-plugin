import { findMissingFonts } from '@plugin/findAllTextnodes';

export const registerChange = (event: NodeChangeEvent): void => {
  if (!changesAreRelevant(event.nodeChanges)) return;

  figma.ui.postMessage({ type: 'CHANGES_DETECTED' });
};

const changesAreRelevant = (changes: NodeChange[]): boolean => {
  for (const change of changes) {
    if (changeIsRelevant(change)) return true;
  }

  return false;
};

const changeIsRelevant = (change: NodeChange): boolean => {
  const node = change.node;

  if (!isTextNode(node) || change.type === 'DELETE') return false;

  return (
    (change.type === 'CREATE' ||
      (change.type === 'PROPERTY_CHANGE' &&
        change.properties.some(
          property => property === 'fontName' || property === 'styledTextSegments'
        ))) &&
    findMissingFonts(node).length > 0
  );
};

const isTextNode = (node: SceneNode | RemovedNode): node is TextNode =>
  node.type === 'TEXT' && 'name' in node;
