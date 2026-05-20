import { Banner, Button, Link } from '@create-figma-plugin/ui';
import { CircleAlert } from 'lucide-react';
import type { JSX } from 'preact';
import { useState } from 'preact/hooks';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';
import type { ErrorPayload } from '@ui/types';
import { ERROR_ISSUES_URL, buildErrorIssueUrl, formatErrorReport } from '@ui/utils';

const ErrorDetails = ({
  error,
  editorType
}: {
  error: ErrorPayload;
  editorType: string;
}): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const report = formatErrorReport(error, editorType);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Stack space="xsmall">
      <pre
        style={{
          margin: 0,
          padding: '8px',
          background: 'var(--figma-color-bg-secondary)',
          border: '1px solid var(--figma-color-border)',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '180px',
          overflow: 'auto'
        }}
      >
        {report}
      </pre>
      <Button secondary onClick={handleCopy} fullWidth>
        {copied ? 'Copied!' : 'Copy error details'}
      </Button>
    </Stack>
  );
};

export const LibraryError = (): JSX.Element => {
  const { retry, cancel, error, editorType } = useFigmaContext();

  const issueUrl = error
    ? buildErrorIssueUrl(formatErrorReport(error, editorType))
    : `${ERROR_ISSUES_URL}/new`;

  return (
    <Stack space="small">
      <Stack space="xsmall">
        <Banner icon={<CircleAlert size={14} />} variant="warning">
          Oops! It looks like there was an <b>error generating the export file</b>.
        </Banner>
        <span>
          Please{' '}
          <Link href={issueUrl} target="_blank">
            open an issue in our Github repository →
          </Link>{' '}
          and we&apos;ll be happy to assist you!
        </span>
        <span style={{ fontSize: '11px', opacity: 0.8 }}>
          <b>Tip:</b> attaching the <code>.fig</code> file (or a minimal reproduction) helps us fix
          this much faster. If it&apos;s confidential, mention it in the issue and we&apos;ll
          arrange a private channel.
        </span>
        {error && <ErrorDetails error={error} editorType={editorType} />}
        <Stack space="xsmall" direction="row">
          <Button onClick={retry} fullWidth>
            Retry
          </Button>
          <Button secondary onClick={cancel} fullWidth>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
