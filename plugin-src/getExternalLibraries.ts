import { isFigJamEditor, isSlidesEditor } from '@plugin/utils';

/**
 * Names of the libraries whose components are used in this file.
 *
 * Reads the `figmaFile` plugin data that `transformComponentNode` stamps on
 * every component when its library is exported, which is the same key
 * `transformInstanceNode` uses to link instances, so a detected library can
 * always be linked. Libraries never exported with the plugin carry no stamp
 * and are skipped, since their instances could not be linked anyway.
 */
const getComponentLibraryNames = async (): Promise<string[]> => {
  await figma.loadAllPagesAsync();

  const instances = figma.root.findAllWithCriteria({ types: ['INSTANCE'] });
  const names = new Set<string>();

  for (const instance of instances) {
    const mainComponent = await instance.getMainComponentAsync();
    if (!mainComponent?.remote) continue;

    const figmaFile = mainComponent.getPluginData('figmaFile');
    if (figmaFile) names.add(figmaFile);
  }

  return Array.from(names);
};

/**
 * Names of the enabled libraries that publish variables. Libraries that only
 * publish components or styles are not listed here.
 */
const getVariableLibraryNames = async (): Promise<string[]> => {
  const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  return collections
    .map(collection => collection.libraryName)
    .filter((name): name is string => Boolean(name));
};

const settle = async (source: string, fetch: () => Promise<string[]>): Promise<string[]> => {
  try {
    return await fetch();
  } catch (error) {
    console.warn(`Could not fetch external libraries from ${source}`, error);
    return [];
  }
};

/**
 * Sends the external libraries to the UI so the user can link them to their
 * Penpot counterparts. Sent once with both sources merged, because each
 * message resets the library fields in the form.
 */
export const sendExternalLibraries = async (): Promise<void> => {
  if (isSlidesEditor() || isFigJamEditor()) return;

  const [componentLibraries, variableLibraries] = await Promise.all([
    settle('components', getComponentLibraryNames),
    settle('variables', getVariableLibraryNames)
  ]);

  figma.ui.postMessage({
    type: 'EXTERNAL_LIBRARIES',
    data: Array.from(new Set([...componentLibraries, ...variableLibraries]))
  });
};
