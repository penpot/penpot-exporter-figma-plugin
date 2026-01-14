import { Muted, Textbox } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Stack } from '@ui/components/Stack';
import type { FormValues } from '@ui/context';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PENPOT_URL_REGEX = /^https?:\/\/[^/]*penpot[^/]*\//i;

type ParseResult = { success: true; fileId: string } | { success: false; error: string };

const parsePenpotUrl = (input: string): ParseResult => {
  const trimmed = input.trim();

  if (trimmed === '') {
    return { success: true, fileId: '' };
  }

  if (UUID_REGEX.test(trimmed)) {
    return { success: true, fileId: trimmed };
  }

  if (!PENPOT_URL_REGEX.test(trimmed)) {
    return {
      success: false,
      error: 'Enter a valid Penpot URL (e.g., https://design.penpot.app/#/...)'
    };
  }

  try {
    const url = new URL(trimmed);
    const hashParams = new URLSearchParams(url.hash.split('?')[1] || '');
    const searchParams = url.searchParams;
    const fileId = hashParams.get('file-id') || searchParams.get('file-id');

    if (!fileId) {
      return { success: false, error: 'URL must contain a file-id parameter' };
    }

    if (!UUID_REGEX.test(fileId)) {
      return { success: false, error: 'The file-id in the URL is not valid' };
    }

    return { success: true, fileId };
  } catch {
    return { success: false, error: 'Invalid URL format' };
  }
};

const validatePenpotUrl = (value: string | undefined): string | true => {
  const result = parsePenpotUrl(value ?? '');
  return result.success ? true : result.error;
};

export const ExternalLibrariesFieldSet = (): JSX.Element => {
  const {
    control,
    formState: { errors }
  } = useFormContext<FormValues>();

  const { fields } = useFieldArray({
    control,
    name: 'externalLibraries'
  });

  const handleInputChange =
    (onChange: (value: string) => void) =>
    (input: string): void => {
      const result = parsePenpotUrl(input);
      onChange(result.success ? result.fileId : input);
    };

  if (fields.length === 0) {
    return <></>;
  }

  return (
    <Stack space="xsmall">
      <strong style={{ fontSize: 13 }}>External Libraries</strong>
      <Muted>Paste the Penpot library URL. Leave empty if not applicable.</Muted>

      {fields.map((field, index) => {
        const fieldError = errors.externalLibraries?.[index]?.uuid;

        return (
          <Stack key={field.id} space="2xsmall">
            <label
              htmlFor={`lib-${field.name}`}
              style={{ fontSize: 12, fontWeight: 500, color: 'var(--figma-color-text)' }}
            >
              {field.name}
            </label>
            <Controller
              name={`externalLibraries.${index}.uuid`}
              control={control}
              rules={{ validate: validatePenpotUrl }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textbox
                  id={`lib-${field.name}`}
                  placeholder="Paste Penpot URL"
                  value={value ?? ''}
                  onValueInput={handleInputChange(onChange)}
                  onBlur={onBlur}
                />
              )}
            />
            {fieldError && (
              <span style={{ fontSize: 11, color: 'var(--figma-color-text-danger)' }}>
                {fieldError.message}
              </span>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};
