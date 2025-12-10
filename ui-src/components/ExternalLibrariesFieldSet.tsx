import { Muted, Textbox } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Stack } from '@ui/components/Stack';
import type { FormValues } from '@ui/context';

const UUID_REGEX = /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ExternalLibrariesFieldSet = (): JSX.Element => {
  const {
    control,
    formState: { errors }
  } = useFormContext<FormValues>();

  const { fields } = useFieldArray({
    control,
    name: 'externalLibraries'
  });

  if (fields.length === 0) {
    return <></>;
  }

  return (
    <Stack space="xsmall">
      <strong style={{ fontSize: 13 }}>External Libraries</strong>
      <Muted>
        Link your external libraries by providing their Penpot library UUIDs. Leave empty if not
        applicable.
      </Muted>

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
              rules={{
                pattern: {
                  value: UUID_REGEX,
                  message: 'Invalid UUID format'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textbox
                  id={`lib-${field.name}`}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={value ?? ''}
                  onValueInput={onChange}
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
