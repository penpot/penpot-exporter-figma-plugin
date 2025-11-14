import { Banner, Button, Link, Muted } from '@create-figma-plugin/ui';
import { CircleAlert, Info } from 'lucide-react';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';
import { fileSizeInMB, formatExportTime } from '@ui/utils';

export const ExportSummary = (): JSX.Element | null => {
  const { exportedBlob, exportTime, missingFonts, downloadBlob, cancel } = useFigmaContext();

  if (!exportedBlob) {
    return null;
  }

  const hasMissingFonts = missingFonts && missingFonts.length > 0;

  return (
    <Stack space="medium">
      <Banner icon={<Info size={14} />} variant="success">
        <strong>Export completed successfully! 🎉</strong>
      </Banner>

      <Stack space="2xsmall">
        <strong style={{ fontSize: 13 }}>{exportedBlob.filename}</strong>
        <p>
          File size: {fileSizeInMB(exportedBlob.blob.size)}
          {exportTime && (
            <>
              <br />
              Export time: {formatExportTime(exportTime)}
            </>
          )}
        </p>
      </Stack>

      {hasMissingFonts && (
        <Stack space="xsmall">
          <Banner icon={<CircleAlert size={14} />} variant="warning">
            <strong>
              {missingFonts.length} custom font{missingFonts.length > 1 ? 's' : ''} detected
            </strong>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
              {missingFonts.map(font => (
                <li key={font}>{font}</li>
              ))}
            </ul>
          </Banner>
          <Muted>
            To use these fonts in Penpot, you&apos;ll need to upload them first.{' '}
            <Link href="https://help.penpot.app/user-guide/custom-fonts/" target="_blank">
              Learn how →
            </Link>
          </Muted>
        </Stack>
      )}

      <Muted>
        Download your file and import it into Penpot via{' '}
        <strong>Projects → Import Penpot file</strong>.{' '}
        <Link
          href="https://help.penpot.app/user-guide/import-export/#importing-files"
          target="_blank"
        >
          Learn more →
        </Link>
      </Muted>

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
