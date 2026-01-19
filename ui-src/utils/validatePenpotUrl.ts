const UUID_REGEX = /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PENPOT_URL_REGEX = /^https?:\/\/[^/]*penpot[^/]*\//i;

type ParseResult = { success: true; fileId: string } | { success: false; error: string };

export const validatePenpotUrl = (value: string | undefined): string | true => {
  const result = parsePenpotUrl(value ?? '');
  return result.success ? true : result.error;
};

export const extractFileIdFromPenpotUrl = (url: string): string | undefined => {
  const result = parsePenpotUrl(url);
  return result.success && result.fileId ? result.fileId : undefined;
};

const parsePenpotUrl = (input: string): ParseResult => {
  const trimmed = input.trim();

  if (trimmed === '') {
    return { success: true, fileId: '' };
  }

  if (!PENPOT_URL_REGEX.test(trimmed)) {
    return {
      success: false,
      error: 'Enter a valid Penpot URL (e.g., https://design.penpot.app/#/...)'
    };
  }

  try {
    const url = new URL(trimmed);
    const hashParams = new URLSearchParams(url.hash.split('?')[1] || '');
    const searchParams = url.searchParams;
    const fileId = hashParams.get('file-id') || searchParams.get('file-id');

    if (!fileId) {
      return { success: false, error: 'URL must contain a file-id parameter' };
    }

    if (!UUID_REGEX.test(fileId)) {
      return { success: false, error: 'The file-id in the URL is not valid' };
    }

    return { success: true, fileId };
  } catch {
    return { success: false, error: 'Invalid URL format' };
  }
};
