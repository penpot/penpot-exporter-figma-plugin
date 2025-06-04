import { Banner, IconInfo32, Link } from '@create-figma-plugin/ui';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

export const MissingFontsSection = () => {
  const { missingFonts } = useFigmaContext();

  if (!missingFonts || !missingFonts.length) return null;

  return (
    <Stack space="small">
      <Stack space="xsmall">
        <Banner icon={<IconInfo32 />}>
          {missingFonts.length} custom font{missingFonts.length > 1 ? 's' : ''} detected:
          <ul style={{ paddingLeft: 20 }}>
            {missingFonts.map(font => (
              <li key={font}>{font}</li>
            ))}
          </ul>
        </Banner>
        <span>
          To export your file with custom fonts, first upload them in Penpot.{' '}
          <Link href="https://help.penpot.app/user-guide/custom-fonts/" target="_blank">
            Learn how to upload fonts.
          </Link>
        </span>
      </Stack>
    </Stack>
  );
};
