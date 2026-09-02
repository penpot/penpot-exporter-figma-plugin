import { describe, expect, it } from 'vitest';

import { extractFileIdFromPenpotUrl, validatePenpotUrl } from '@ui/utils/validatePenpotUrl';

const FILE_ID = 'c7f0d1de-77e4-80e0-8007-32b4b1bbd8b1';

describe('validatePenpotUrl', () => {
  it('accepts an empty value', () => {
    expect(validatePenpotUrl('')).toBe(true);
    expect(validatePenpotUrl('   ')).toBe(true);
    expect(validatePenpotUrl(undefined)).toBe(true);
  });

  it('accepts a Penpot SaaS URL with a file-id in the hash', () => {
    expect(
      validatePenpotUrl(
        `https://design.penpot.app/#/workspace?team-id=${FILE_ID}&file-id=${FILE_ID}&page-id=${FILE_ID}`
      )
    ).toBe(true);
  });

  it('accepts a self-hosted localhost URL', () => {
    expect(
      validatePenpotUrl(`http://localhost:9001/#/workspace?team-id=${FILE_ID}&file-id=${FILE_ID}`)
    ).toBe(true);
  });

  it('accepts a self-hosted URL without "penpot" in the domain', () => {
    expect(validatePenpotUrl(`https://design.example.com/#/workspace?file-id=${FILE_ID}`)).toBe(
      true
    );
  });

  it('accepts a file-id in the query string instead of the hash', () => {
    expect(validatePenpotUrl(`https://design.penpot.app/view?file-id=${FILE_ID}`)).toBe(true);
  });

  it('rejects a URL without a file-id parameter', () => {
    expect(validatePenpotUrl('http://localhost:9001/#/workspace?team-id=1')).toBe(
      'URL must contain a file-id parameter'
    );
  });

  it('rejects a URL with an invalid file-id', () => {
    expect(validatePenpotUrl('https://design.penpot.app/#/workspace?file-id=not-a-uuid')).toBe(
      'The file-id in the URL is not valid'
    );
  });

  it('rejects non-http(s) protocols', () => {
    expect(validatePenpotUrl(`ftp://design.penpot.app/#/workspace?file-id=${FILE_ID}`)).toBe(
      'Enter a valid Penpot URL (e.g., https://design.penpot.app/#/... or your self-hosted instance URL)'
    );
  });

  it('rejects plain text that is not a URL', () => {
    expect(validatePenpotUrl('not a url')).toBe('Invalid URL format');
  });
});

describe('extractFileIdFromPenpotUrl', () => {
  it('extracts the file-id from a valid URL', () => {
    expect(extractFileIdFromPenpotUrl(`http://localhost:9001/#/workspace?file-id=${FILE_ID}`)).toBe(
      FILE_ID
    );
  });

  it('returns undefined for an invalid URL', () => {
    expect(extractFileIdFromPenpotUrl('not a url')).toBeUndefined();
  });

  it('returns undefined for an empty value', () => {
    expect(extractFileIdFromPenpotUrl('')).toBeUndefined();
  });
});
