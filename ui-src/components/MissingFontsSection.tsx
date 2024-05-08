import { Banner, IconInfo32, Stack, Text, Textbox } from '@create-figma-plugin/ui';
import { Controller, useFormContext } from 'react-hook-form';

type MissingFontsSectionProps = {
  fonts: string[];
};

export const MissingFontsSection = ({ fonts }: MissingFontsSectionProps) => {
  if (!fonts.length) return null;

  return (
    <Stack space="medium">
      <Banner icon={<IconInfo32 />}>
        {fonts.length} custom font{fonts.length > 1 ? 's' : ''} detected
      </Banner>
      <Stack space="small">
        <Text>To export your file with custom fonts, please follow these steps:</Text>
        <ol
          style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <li>
            Upload your local fonts in Penpot.{' '}
            <a href="https://www.google.com" target="_blank" rel="noreferrer">
              Learn how to do it.
            </a>
          </li>
          <li>Copy and paste the font IDs from Penpot below.</li>
        </ol>
      </Stack>
      {fonts.map(font => (
        <Stack space="extraSmall" key={font}>
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
