import { LoadingIndicator } from '@create-figma-plugin/ui';

import { useFigma } from '@ui/context';

import { ExportForm } from './ExportForm';
import { ExporterProgress } from './ExporterProgress';
import { PluginReload } from './PluginReload';

export const PenpotExporter = () => {
  const { loading, needsReload, exporting } = useFigma();

  if (loading) return <LoadingIndicator />;

  if (exporting) return <ExporterProgress />;

  if (needsReload) return <PluginReload />;

  return <ExportForm />;
};
