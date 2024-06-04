import { Banner, IconInfo32, Link, Textbox } from '@create-figma-plugin/ui';
import { Controller, useFormContext } from 'react-hook-form';

import { useFigmaContext } from '@ui/context';

import { Stack } from './Stack';

export const MissingFontsSection = () => {
  const { missingFonts } = useFigmaContext();

  if (!missingFonts || !missingFonts.length) return null;

  return (
    <Stack space="small">
      <Stack space="xsmall">
        <Banner icon={<IconInfo32 />}>
          {missingFonts.length} custom font{missingFonts.length > 1 ? 's' : ''} detected
        </Banner>
        <span>To export your file with custom fonts, please follow these steps:</span>
        <Stack as="ol" space="xsmall" style={{ paddingLeft: '1rem' }}>
          <li>
            Before exporting the file, upload your custom local fonts in Penpot.
            <br />
            <Link
              href="https://help.penpot.app/user-guide/custom-fonts/"
              target="_blank"
              rel="noreferrer"
            >
              Learn how to do it.
            </Link>
          </li>
          <li>
            Follow this{' '}
            <Link
              href="https://github.com/penpot/penpot-exporter-figma-plugin/wiki/Step-by-Step-guide-to-finding-Font-Ids-in-Penpot"
              target="_blank"
              rel="noreferrer"
            >
              step-by-step guide
            </Link>{' '}
            to locate and copy the font IDs from Penpot
          </li>
          <li>Return here and paste the font IDs in the section below</li>
        </Stack>
      </Stack>
      {missingFonts.map(font => (
        <Stack space="2xsmall" key={font}>
          <ControlledTextbox name={font} placeholder="Paste font ID from Penpot" />
          <span>{font}</span>
        </Stack>
      ))}
    </Stack>
  );
};

type ControlledTextboxProps = { name: string; placeholder: string };

const ControlledTextbox = ({ name, placeholder }: ControlledTextboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Textbox
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          variant="border"
        />
      )}
    />
  );
};
