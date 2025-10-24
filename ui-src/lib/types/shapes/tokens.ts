export type Tokens = {
  $metadata: Metadata;
  $themes: Theme[];
};

export type TokenSets = Record<string, Set>;

export type Set = {
  [key: string]: Token;
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
  $value: string | number;
  $type: TokenType;
  $description: string;
};

export type Metadata = {
  tokenSetOrder: string[];
  activeThemes: string[];
  activeSets: string[];
};

export type Theme = {
  'name': string;
  'group': string;
  'description': string;
  'is-source': boolean;
  'modified-at': string;
  'selectedTokenSets': Record<string, 'enabled'>;
};
