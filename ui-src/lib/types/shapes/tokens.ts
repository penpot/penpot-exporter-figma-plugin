import type { Uuid } from '@ui/lib/types/utils/uuid';

export type Tokens = {
  $metadata: Metadata;
  $themes: Theme[];
};

export type TokenSets = Record<string, Set>;

export type Set = {
  [key: string]: Token | Record<string, Token>;
};

export type TokenType =
  | 'color'
  | 'number'
  | 'dimension'
  | 'rotation'
  | 'spacing'
  | 'opacity'
  | 'sizing'
  | 'borderRadius'
  | 'borderWidth'
  | 'fontFamilies'
  | 'fontSizes'
  | 'fontWeights'
  | 'textDecoration'
  | 'letterSpacing'
  | 'textCase';

export type Token = {
  $value: string | string[];
  $type: TokenType;
  $description: string;
};

export type Metadata = {
  tokenSetOrder: string[];
  activeThemes: string[];
  activeSets: string[];
};

export type Theme = {
  id?: Uuid;
  name: string;
  group: string;
  description: string;
  isSource: boolean;
  selectedTokenSets: Record<string, 'enabled'>;
};
