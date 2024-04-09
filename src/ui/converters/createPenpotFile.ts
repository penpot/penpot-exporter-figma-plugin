import { createPenpotItem } from '.';
import { ExportFile, NodeData } from '../../common/interfaces';
import { createFile } from '../penpot';

export const createPenpotFile = (node: NodeData) => {
  const exportFile = { penpotFile: createFile(node.name), fontNames: new Set<FontName>() };
  for (const page of node.children) {
    createPenpotItem(exportFile as ExportFile, page, 0, 0);
  }
  return exportFile;
};
