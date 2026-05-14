export const isSlidesEditor = (): boolean =>
  typeof figma !== 'undefined' && figma.editorType === 'slides';
export const isFigJamEditor = (): boolean =>
  typeof figma !== 'undefined' && figma.editorType === 'figjam';
