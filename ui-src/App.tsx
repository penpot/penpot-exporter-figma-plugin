import { Container, Stack, VerticalSpace } from '@create-figma-plugin/ui';

import Logo from '@ui/assets/logo.svg?react';
import { PenpotExporter } from '@ui/components/PenpotExporter';

export const App = () => (
  <Container space="medium">
    <VerticalSpace space="medium" />
    <Stack space="medium">
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Logo style={{ height: 'auto', width: '2rem', fill: 'var(--figma-color-icon)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, lineHeight: '166.667%' }}>
          Penpot Exporter
        </h2>
      </div>
      <PenpotExporter />
    </Stack>
  </Container>
);
