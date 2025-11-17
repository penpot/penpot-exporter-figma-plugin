import { Divider, Muted, Text } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';

declare const APP_VERSION: string;
declare const __DEV__: boolean;

const AppFooter = (): JSX.Element => {
  return (
    <>
      <Divider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {__DEV__ && (
          <span
            style={{
              padding: '0.125rem 0.375rem',
              marginLeft: '1rem',
              backgroundColor: '#ff6b35',
              color: 'white',
              borderRadius: '0.25rem',
              fontSize: '9px',
              fontWeight: 'bold'
            }}
          >
            DEV
          </span>
        )}

        <Text style={{ margin: '0.5rem', marginRight: '1rem' }}>
          <Muted>v{APP_VERSION}</Muted>
        </Text>
      </div>
    </>
  );
};

export { AppFooter };
