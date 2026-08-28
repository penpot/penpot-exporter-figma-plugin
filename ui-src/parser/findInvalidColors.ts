import type { PenpotDocument } from '@ui/types';

const MAX_INVALID_COLORS = 10;
const STRUCTURAL_PATH_SEGMENTS = new Set(['children', 'fills', 'strokes', 'shadow']);
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const COLOR_ALIAS_PATTERN = /^\{[^{}]+\}$/;
const RGB_COLOR_PATTERN = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
const RGBA_COLOR_PATTERN =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?)\s*\)$/i;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === 'object' && value !== null;
};

const areRgbChannelsValid = (channels: string[]): boolean => {
  return channels.every(channel => Number(channel) >= 0 && Number(channel) <= 255);
};

const isValidColor = (value: string): boolean => {
  if (HEX_COLOR_PATTERN.test(value) || COLOR_ALIAS_PATTERN.test(value)) {
    return true;
  }

  const rgbMatch = value.match(RGB_COLOR_PATTERN);
  if (rgbMatch) {
    return areRgbChannelsValid(rgbMatch.slice(1));
  }

  const rgbaMatch = value.match(RGBA_COLOR_PATTERN);
  if (rgbaMatch) {
    return areRgbChannelsValid(rgbaMatch.slice(1, 4));
  }

  return false;
};

const truncate = (value: string): string => {
  return value.length > 30 ? `${value.slice(0, 27)}...` : value;
};

const formatDescriptor = (path: string[], field: string, value: string): string => {
  const visiblePath = path.filter(
    segment => !STRUCTURAL_PATH_SEGMENTS.has(segment) && !/^\d+$/.test(segment)
  );

  return `${visiblePath.join(' > ')}.${field} = ${truncate(value)}`;
};

const isColorField = (key: string, value: unknown): value is string => {
  return typeof value === 'string' && key.toLowerCase().includes('color') && !key.includes('Ref');
};

const addInvalidColor = (results: string[], path: string[], field: string, value: string): void => {
  if (!isValidColor(value) && results.length < MAX_INVALID_COLORS) {
    results.push(formatDescriptor(path, field, value));
  }
};

const scanValue = (
  value: unknown,
  path: string[],
  results: string[],
  visited: WeakSet<object>
): void => {
  if (results.length >= MAX_INVALID_COLORS) return;

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index++) {
      scanValue(value[index], [...path, String(index + 1)], results, visited);
    }

    return;
  }

  if (!isRecord(value) || visited.has(value)) return;

  visited.add(value);

  const name = typeof value.name === 'string' ? value.name : undefined;
  const currentPath = name ? [...path, name] : path;

  if (value.$type === 'color' && typeof value.$value === 'string') {
    addInvalidColor(results, currentPath, '$value', value.$value);
  }

  for (const [key, child] of Object.entries(value)) {
    if (isColorField(key, child)) {
      addInvalidColor(results, currentPath, key, child);
    }

    scanValue(child, [...currentPath, key], results, visited);
  }
};

export const findInvalidColors = (document: PenpotDocument): string[] => {
  const results: string[] = [];

  scanValue(document, ['document'], results, new WeakSet());

  return results;
};
