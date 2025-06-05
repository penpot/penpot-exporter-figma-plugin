import { Button } from '@create-figma-plugin/ui';
import { FormProvider, useForm } from 'react-hook-form';

import { MissingFontsSection } from '@ui/components/MissingFontsSection';
import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export type FormValues = Record<string, string>;

export const ExportForm = () => {
  const { cancel, exportPenpot } = useFigmaContext();
  const methods = useForm<FormValues>();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(exportPenpot)}>
        <Stack>
          <MissingFontsSection />
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
