import { Button } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';
import { FormProvider, useForm } from 'react-hook-form';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export type FormValues = Record<string, string>;

export const ExportForm = (): JSX.Element => {
  const { cancel, exportPenpot } = useFigmaContext();
  const methods = useForm<FormValues>();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(exportPenpot)}>
        <Stack>
          <Stack space="xsmall" direction="row">
            <Button fullWidth>Export to Penpot</Button>
            <Button secondary onClick={cancel} fullWidth>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};
