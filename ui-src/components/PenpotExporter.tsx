import { LoadingIndicator } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';

import { ExportForm } from '@ui/components/ExportForm';
import { ExporterProgress } from '@ui/components/ExporterProgress';
import { LibraryError } from '@ui/components/LibraryError';
import { PluginReload } from '@ui/components/PluginReload';
import { useFigmaContext } from '@ui/context';

export const PenpotExporter = (): JSX.Element => {
  const { loading, needsReload, exporting, error } = useFigmaContext();

  if (loading) return <LoadingIndicator />;

  if (exporting) return <ExporterProgress />;

  if (needsReload) return <PluginReload />;

  if (error) return <LibraryError />;

  return <ExportForm />;
};
