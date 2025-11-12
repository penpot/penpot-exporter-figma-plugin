import { Divider, Muted, Text } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';

declare const APP_VERSION: string;

const AppFooter = (): JSX.Element => {
  return (
    <>
      <Divider />

      <Text align="right" style={{ padding: '0.5rem' }}>
        <Muted>v{APP_VERSION}</Muted>
      </Text>
    </>
  );
};

export { AppFooter };
