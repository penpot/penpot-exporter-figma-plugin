import { Muted, SegmentedControl, type SegmentedControlOption } from '@create-figma-plugin/ui';
import type { JSX, TargetedEvent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useFormContext } from 'react-hook-form';

import { ExternalLibrariesFieldSet } from '@ui/components/ExternalLibrariesFieldSet';
import { Stack } from '@ui/components/Stack';
import { type FormValues, useFigmaContext } from '@ui/context';
import type { ExportScope } from '@ui/types';

const scopeOptions: SegmentedControlOption[] = [
  { value: 'all', children: 'All pages' },
  { value: 'current', children: 'Current page' }
];

export const DesignExportControls = (): JSX.Element => {
  const { exportScope, exportLibraries, setExportScope } = useFigmaContext();
  const { reset } = useFormContext<FormValues>();

  useEffect(() => {
    if (exportLibraries.length > 0) {
      reset({
        externalLibraries: exportLibraries.map(name => ({ name, uuid: '' }))
      });
    }
  }, [exportLibraries]);

  const handleScopeChange = (event: TargetedEvent<HTMLInputElement>): void => {
    setExportScope(event.currentTarget.value as ExportScope);
  };

  return (
    <Stack space="medium">
      <Stack space="xsmall">
        <strong style={{ fontSize: 13 }}>Export scope</strong>
        <div style={{ width: 'fit-content' }}>
          <SegmentedControl
            options={scopeOptions}
            value={exportScope}
            onChange={handleScopeChange}
          />
        </div>
        <Muted>
          For large documents, try exporting the current page first to test, then do a full export.
        </Muted>
      </Stack>

      <ExternalLibrariesFieldSet />
    </Stack>
  );
};
