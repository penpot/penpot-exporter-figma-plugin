import { LoadingIndicator } from '@create-figma-plugin/ui';

import { useFigmaContext } from '@ui/context';

import { ExportForm } from './ExportForm';
import { ExporterProgress } from './ExporterProgress';
import { PluginReload } from './PluginReload';

export const PenpotExporter = () => {
  const { loading, needsReload, exporting } = useFigmaContext();

  if (loading) return <LoadingIndicator />;

  if (exporting) return <ExporterProgress />;

  if (needsReload) return <PluginReload />;

  return <ExportForm />;
};
