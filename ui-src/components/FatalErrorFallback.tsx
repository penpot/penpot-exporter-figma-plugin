import { Banner, Button, Link } from '@create-figma-plugin/ui';
import { CircleAlert } from 'lucide-react';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { ERROR_ISSUES_URL, buildErrorIssueUrl, formatErrorReport } from '@ui/utils';

type Props = {
  error: Error;
};

export const FatalErrorFallback = ({ error }: Props): JSX.Element => {
  const report = formatErrorReport(
    { message: error.message, stack: error.stack, origin: 'ui' },
    'figma'
  );
  const issueUrl = buildErrorIssueUrl(report);

  const reload = (): void => {
    window.location.reload();
  };

  return (
    <div style={{ padding: '16px' }}>
      <Stack space="small">
        <Banner icon={<CircleAlert size={14} />} variant="warning">
          The plugin crashed unexpectedly.
        </Banner>
        <span>
          Please{' '}
          <Link href={issueUrl} target="_blank">
            open an issue in our Github repository →
          </Link>{' '}
          so we can fix this.
        </span>
        <Button onClick={reload} fullWidth>
          Reload plugin
        </Button>
        <Link href={`${ERROR_ISSUES_URL}/new`} target="_blank">
          Or open a blank issue
        </Link>
      </Stack>
    </div>
  );
};
