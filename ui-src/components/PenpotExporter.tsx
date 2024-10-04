import { LoadingIndicator } from '@create-figma-plugin/ui';

import { LibraryError } from '@ui/components/LibraryError';
import { useFigmaContext } from '@ui/context';

import { ExportForm } from './ExportForm';
import { ExporterProgress } from './ExporterProgress';
import { PluginReload } from './PluginReload';

export const PenpotExporter = () => {
  const { loading, needsReload, exporting, error } = useFigmaContext();

  if (loading) return <LoadingIndicator />;

  if (exporting) return <ExporterProgress />;

  if (needsReload) return <PluginReload />;

  if (error) return <LibraryError />;

  return <ExportForm />;
};
