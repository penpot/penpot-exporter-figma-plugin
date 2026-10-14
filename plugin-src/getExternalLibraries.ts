import { isFigJamEditor, isSlidesEditor } from '@plugin/utils';

// Same `figmaFile` key `transformInstanceNode` links instances with.
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

// Sent once: each message resets the library fields in the form.
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
