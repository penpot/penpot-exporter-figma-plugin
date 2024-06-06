// @TODO: Direct import on purpose, to avoid problems with the tsc linting
import { sleep } from '@plugin/utils/sleep';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotPage } from '@ui/lib/types/penpotPage';

import { createItems } from '.';

export const createPage = async (
  file: PenpotFile,
  { name, options, children = [] }: PenpotPage
) => {
  file.addPage(name, options);

  createItems(file, children);

  await sleep(0);

  file.closePage();
};
