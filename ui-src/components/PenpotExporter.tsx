import type { JSX } from 'preact';

import { ExportForm } from '@ui/components/ExportForm';
import { ExportSummary } from '@ui/components/ExportSummary';
import { ExporterProgress } from '@ui/components/ExporterProgress';
import { ExternalVariablesWarning } from '@ui/components/ExternalVariablesWarning';
import { LibraryError } from '@ui/components/LibraryError';
import { useFigmaContext } from '@ui/context';

export const PenpotExporter = (): JSX.Element => {
  const { exporting, summary, error, externalVariablesWarning } = useFigmaContext();

  if (exporting) return <ExporterProgress />;

  if (summary) return <ExportSummary />;

  if (error) return <LibraryError />;

  if (externalVariablesWarning && externalVariablesWarning.length > 0) {
    return <ExternalVariablesWarning />;
  }

  return <ExportForm />;
};
