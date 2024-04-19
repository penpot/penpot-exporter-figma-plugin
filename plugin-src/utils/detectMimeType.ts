export interface Signatures {
  [key: string]: string;
}

const signatures: Signatures = {
  'R0lGODdh': 'image/gif',
  'R0lGODlh': 'image/gif',
  'iVBORw0KGgo': 'image/png',
  '/9j/': 'image/jpg'
};

export const detectMimeType = (b64: string) => {
  for (const s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s];
    }
  }
};
