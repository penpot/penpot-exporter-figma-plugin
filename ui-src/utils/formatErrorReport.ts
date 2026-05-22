import type { ErrorPayload } from '@ui/types';

declare const APP_VERSION: string;

const ISSUES_URL = 'https://github.com/penpot/penpot-exporter-figma-plugin/issues';

export const formatErrorReport = (error: ErrorPayload, editorType: string): string => {
  const lines = [`Plugin version: ${APP_VERSION}`, `File type: ${editorType}`];

  if (error.step) lines.push(`Step: ${error.step}`);
  if (error.layer) lines.push(`Layer: ${error.layer}`);

  lines.push('', `Message: ${error.message}`);

  if (error.stack) {
    lines.push('', 'Stack:', error.stack);
  }

  return lines.join('\n');
};

export const buildErrorIssueUrl = (report: string): string => {
  const title = encodeURIComponent('Export error');
  const body = encodeURIComponent(
    [
      '## Error report',
      '',
      'Please describe what you were exporting (file contents, selection, etc.):',
      '',
      '',
      '## Figma file (very helpful!)',
      '',
      'If possible, **attach the `.fig` file** (or a minimal reproduction) that triggered the error.',
      'Drag-and-drop the file into this comment box to attach it.',
      '',
      "If the file is confidential, share it privately with the maintainers (mention you'd prefer that and we'll coordinate), or attach a stripped-down version that still reproduces the issue.",
      '',
      '## Technical details',
      '',
      '```',
      report,
      '```'
    ].join('\n')
  );
  return `${ISSUES_URL}/new?title=${title}&body=${body}`;
};

export const ERROR_ISSUES_URL = ISSUES_URL;
