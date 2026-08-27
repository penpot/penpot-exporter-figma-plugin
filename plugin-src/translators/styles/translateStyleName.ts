// Penpot rejects blank asset names, and Figma style names can end in "/"
// (e.g. "Primary/"), leaving an empty last segment.
export const translateStyleName = (figmaStyle: BaseStyle): string => {
  const lastNonBlankSegment = figmaStyle.name
    .split('/')
    .filter(segment => segment.trim().length > 0)
    .pop();

  return lastNonBlankSegment?.trim() ?? 'Untitled';
};
