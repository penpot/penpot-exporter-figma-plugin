export const isSlidesEditor = (): boolean => figma.editorType === 'slides';

export const isFigJamEditor = (): boolean =>
  typeof figma !== 'undefined' && figma.editorType === 'figjam';

// FigJam runtime has no `figma.getStyleByIdAsync` API. Expose this as an
// editor capability so partials gate on a behaviour, not an editor name.
export const editorSupportsStylesApi = (): boolean => !isFigJamEditor();
