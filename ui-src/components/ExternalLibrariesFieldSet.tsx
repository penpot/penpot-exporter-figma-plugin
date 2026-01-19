import { Link, Muted, Textbox } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Stack } from '@ui/components/Stack';
import type { FormValues } from '@ui/context';
import { validatePenpotUrl } from '@ui/utils';

export const ExternalLibrariesFieldSet = (): JSX.Element => {
  const {
    control,
    formState: { errors }
  } = useFormContext<FormValues>();

  const { fields } = useFieldArray({
    control,
    name: 'externalLibraries'
  });

  const howToLink = (
    <Link
      href="https://github.com/penpot/penpot-exporter-figma-plugin/wiki/How-to-export-design-systems-(libraries)"
      target="_blank"
    >
      How to export libraries →
    </Link>
  );

  if (fields.length === 0) {
    return (
      <Stack space="xsmall">
        <strong style={{ fontSize: 13 }}>External Libraries</strong>
        <Muted>
          If this is a design system or a file that uses a design system, you might want to learn
          how to export libraries and link them to your other files.
          <br />
          {howToLink}
        </Muted>
      </Stack>
    );
  }

  return (
    <Stack space="xsmall">
      <strong style={{ fontSize: 13 }}>External Libraries</strong>
      <Muted>
        Link your external libraries by providing their Penpot library URL. Leave empty if not
        applicable. {howToLink}
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
              rules={{ validate: validatePenpotUrl }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textbox
                  id={`lib-${field.name}`}
                  placeholder="e.g. https://design.penpot.app/#/workspace?team-id=...&file-id=...&page-id=..."
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
