import { Button, Muted } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';

import { Stack } from '@ui/components/Stack';
import { Wrapper } from '@ui/components/Wrapper';

type Props = {
  libraries: string[];
  onExportAsIs: () => void;
  onConvertToLocal: () => void;
  onCancel: () => void;
};

export const ExternalVariablesWarning = ({
  libraries,
  onExportAsIs,
  onConvertToLocal,
  onCancel
}: Props): JSX.Element => {
  const libraryList = libraries.length > 0 ? libraries.join(', ') : 'external libraries';

  return (
    <Wrapper>
      <Stack space="medium">
        <Stack space="medium">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: 'var(--figma-color-bg-warning-tertiary, #fff3cd)',
              borderRadius: '0.25rem',
              border: '1px solid var(--figma-color-border-warning, #ffc107)'
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--figma-color-icon-warning, #f59e0b)', flexShrink: 0 }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <strong style={{ fontSize: 13 }}>External Design System Variables Detected</strong>
          </div>

          <Stack space="small">
            <p style={{ margin: 0 }}>
              This file uses variables from external libraries: <strong>{libraryList}</strong>.
            </p>
            <p style={{ margin: 0 }}>
              Penpot doesn&apos;t support linked libraries the same way Figma does. Choose how you
              want to handle these variables:
            </p>
          </Stack>
        </Stack>

        <Stack space="medium">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                padding: '0.75rem',
                border: '1px solid var(--figma-color-border)',
                borderRadius: '0.25rem'
              }}
            >
              <Stack space="xsmall">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <strong style={{ fontSize: 13 }}>Convert to local variables</strong>
                  <Button onClick={onConvertToLocal} style={{ flexShrink: 0 }}>
                    Convert & Export
                  </Button>
                </div>
                <Muted>
                  External variables will be copied into the exported file as local tokens. This
                  preserves the variable connections in Penpot but creates duplicates.
                </Muted>
              </Stack>
            </div>

            <div
              style={{
                padding: '0.75rem',
                border: '1px solid var(--figma-color-border)',
                borderRadius: '0.25rem'
              }}
            >
              <Stack space="xsmall">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <strong style={{ fontSize: 13 }}>Export as is</strong>
                  <Button secondary onClick={onExportAsIs} style={{ flexShrink: 0 }}>
                    Export Without
                  </Button>
                </div>
                <Muted>
                  External variable references will be skipped. Elements will keep their visual
                  appearance but won&apos;t have token connections in Penpot.
                </Muted>
              </Stack>
            </div>
          </div>
        </Stack>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--figma-color-border)'
          }}
        >
          <Button secondary onClick={onCancel}>
            Cancel Export
          </Button>
        </div>
      </Stack>
    </Wrapper>
  );
};
