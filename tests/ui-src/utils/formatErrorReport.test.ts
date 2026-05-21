import { beforeAll, describe, expect, it } from 'vitest';

import type { ErrorPayload } from '@ui/types';
import { buildErrorIssueUrl, formatErrorReport } from '@ui/utils/formatErrorReport';

(globalThis as { APP_VERSION?: string }).APP_VERSION = '0.22.0';

const basePayload: ErrorPayload = {
  message: 'boom',
  origin: 'plugin'
};

describe('formatErrorReport', () => {
  beforeAll(() => {
    (globalThis as { APP_VERSION?: string }).APP_VERSION = '0.22.0';
  });

  it('includes plugin version and editor type', () => {
    const report = formatErrorReport(basePayload, 'figma');

    expect(report).toContain('Plugin version: 0.22.0');
    expect(report).toContain('File type: figma');
    expect(report).toContain('Message: boom');
  });

  it('omits step and layer when missing', () => {
    const report = formatErrorReport(basePayload, 'figma');

    expect(report).not.toContain('Step:');
    expect(report).not.toContain('Layer:');
  });

  it('includes step and layer when present', () => {
    const report = formatErrorReport(
      { ...basePayload, step: 'processing', layer: 'Vector' },
      'figma'
    );

    expect(report).toContain('Step: processing');
    expect(report).toContain('Layer: Vector');
  });

  it('includes stack when present', () => {
    const report = formatErrorReport(
      { ...basePayload, stack: 'Error: boom\n    at foo:1:1' },
      'figma'
    );

    expect(report).toContain('Stack:');
    expect(report).toContain('at foo:1:1');
  });

  it('reflects non-figma editor type', () => {
    const report = formatErrorReport(basePayload, 'slides');

    expect(report).toContain('File type: slides');
  });
});

describe('buildErrorIssueUrl', () => {
  it('points to the project issues new endpoint', () => {
    const url = buildErrorIssueUrl('any report');

    expect(url).toMatch(
      /^https:\/\/github\.com\/penpot\/penpot-exporter-figma-plugin\/issues\/new\?title=/
    );
  });

  it('URL-encodes the report into the body', () => {
    const url = buildErrorIssueUrl('line one\nline two');
    const body = decodeURIComponent(url.split('&body=')[1] ?? '');

    expect(body).toContain('line one\nline two');
  });

  it('asks for the .fig file in the issue body', () => {
    const url = buildErrorIssueUrl('report');
    const body = decodeURIComponent(url.split('&body=')[1] ?? '');

    expect(body).toContain('.fig');
    expect(body).toContain('attach');
  });

  it('uses a stable issue title', () => {
    const url = buildErrorIssueUrl('report');
    const title = decodeURIComponent(url.split('title=')[1]?.split('&')[0] ?? '');

    expect(title).toBe('Export error');
  });
});
