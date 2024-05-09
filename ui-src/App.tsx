import Penpot from '@ui/assets/penpot.svg?react';
import { PenpotExporter } from '@ui/components/PenpotExporter';
import { Stack } from '@ui/components/Stack';

import { Wrapper } from './components/Wrapper/Wrapper';

export const App = () => (
  <Wrapper>
    <Stack space="medium">
      <Penpot
        style={{
          alignSelf: 'center',
          height: 'auto',
          width: '8.125rem',
          fill: 'var(--figma-color-icon)'
        }}
      />
      <PenpotExporter />
    </Stack>
  </Wrapper>
);
