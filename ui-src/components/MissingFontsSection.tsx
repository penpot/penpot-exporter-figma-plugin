import { Banner, IconInfo32, Link, Text, Textbox } from '@create-figma-plugin/ui';
import { Controller, useFormContext } from 'react-hook-form';

import { Stack } from './Stack';

type MissingFontsSectionProps = {
  fonts?: string[];
};

export const MissingFontsSection = ({ fonts }: MissingFontsSectionProps) => {
  if (!fonts || !fonts.length) return null;

  return (
    <Stack space="medium">
      <Banner icon={<IconInfo32 />}>
        {fonts.length} custom font{fonts.length > 1 ? 's' : ''} detected
      </Banner>
      <Stack space="small">
        <Text>To export your file with custom fonts, please follow these steps:</Text>
        <Stack as="ol" space="extra-small" style={{ paddingLeft: '1rem' }}>
          <li>
            Upload your local fonts in Penpot.
            <br />
            <Link href="https://www.google.com" target="_blank" rel="noreferrer">
              Learn how to do it.
            </Link>
          </li>
          <li>Copy and paste the font IDs from Penpot below.</li>
        </Stack>
      </Stack>
      {fonts.map(font => (
        <Stack space="extra-small" key={font}>
          <ControlledTextbox name={font} placeholder="Enter Penpot font id" />
          <Text>{font}</Text>
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
        <Textbox onChange={onChange} onBlur={onBlur} value={value} placeholder={placeholder} />
      )}
    />
  );
};
