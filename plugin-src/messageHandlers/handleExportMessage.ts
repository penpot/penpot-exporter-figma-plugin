import { transformDocumentNode } from '@plugin/transformers';

export async function handleExportMessage() {
  await figma.loadAllPagesAsync();

  const penpotNode = await transformDocumentNode(figma.root);
  figma.ui.postMessage({ type: 'FIGMAFILE', data: penpotNode });
}
