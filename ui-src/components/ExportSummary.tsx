import {
  Banner,
  Button,
  IconInfo16,
  IconInfoSmall24,
  IconWarning16,
  Link
} from '@create-figma-plugin/ui';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export const ExportSummary = (): JSX.Element | null => {
  const { exportedBlob, missingFonts, downloadBlob, cancel } = useFigmaContext();

  if (!exportedBlob) {
    return null;
  }

  const fileSizeMB = (exportedBlob.blob.size / (1024 * 1024)).toFixed(2);
  const hasMissingFonts = missingFonts && missingFonts.length > 0;
  const isLargeFile = parseFloat(fileSizeMB) > 150;

  return (
    <Stack space="medium">
      {/* Success Banner */}
      <Banner icon={<IconInfoSmall24 />} variant="success">
        Export completed successfully! 🎉
      </Banner>

      {/* File Information */}
      <Stack space="xsmall">
        <div style={{ fontSize: '13px' }}>
          <strong>{exportedBlob.filename}</strong>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--figma-color-text-secondary)' }}>
          File size: {fileSizeMB} MB
        </div>
      </Stack>

      {/* Large File Warning */}
      {isLargeFile && (
        <Banner icon={<IconWarning16 />} variant="warning">
          This is a large file ({fileSizeMB} MB). Download it soon to free up browser memory.
        </Banner>
      )}

      {/* Missing Fonts Warning */}
      {hasMissingFonts && (
        <Stack space="xsmall">
          <Banner icon={<IconInfo16 />} variant="warning">
            <strong>
              {missingFonts.length} custom font{missingFonts.length > 1 ? 's' : ''} detected
            </strong>
            <ul style={{ paddingLeft: 20, margin: '4px 0 0 0' }}>
              {missingFonts.map(font => (
                <li key={font}>{font}</li>
              ))}
            </ul>
          </Banner>
          <div style={{ fontSize: '11px', color: 'var(--figma-color-text-secondary)' }}>
            To use these fonts in Penpot, you&apos;ll need to upload them first.{' '}
            <Link href="https://help.penpot.app/user-guide/custom-fonts/" target="_blank">
              Learn how →
            </Link>
          </div>
        </Stack>
      )}

      {/* Download Instructions */}
      <div style={{ fontSize: '11px', color: 'var(--figma-color-text-secondary)' }}>
        Download your file and import it into Penpot via{' '}
        <strong>Projects → Import Penpot file</strong>.{' '}
        <Link
          href="https://help.penpot.app/user-guide/import-export/#importing-files"
          target="_blank"
        >
          Learn more →
        </Link>
      </div>

      {/* Action Buttons */}
      <Stack space="xsmall" direction="row">
        <Button fullWidth onClick={downloadBlob}>
          Download File
        </Button>
        <Button secondary fullWidth onClick={cancel}>
          Close
        </Button>
      </Stack>
    </Stack>
  );
};
