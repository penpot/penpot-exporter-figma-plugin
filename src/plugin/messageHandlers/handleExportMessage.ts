import { NodeData, TextData } from '../../common/interfaces';
import { traverse } from '../figma';

export async function handleExportMessage() {
  await figma.loadAllPagesAsync(); // ensures all PageNodes are loaded
  const root: NodeData | TextData = await traverse(figma.root); // start the traversal at the root
  figma.ui.postMessage({ type: 'FIGMAFILE', data: root });
}
