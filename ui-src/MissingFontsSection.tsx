type MissingFontsSectionProps = {
  missingFonts: string[];
};

export const MissingFontsSection = ({ missingFonts }: MissingFontsSectionProps) => {
  if (missingFonts === undefined || !missingFonts.length) return;
  return (
    <section>
      <div id="missing-fonts">
        {missingFonts.length} non-default font
        {missingFonts.length > 1 ? 's' : ''}:{' '}
      </div>
      <small>Ensure fonts are installed in Penpot before exporting.</small>
      <div id="missing-fonts-list">
        <ul>
          {Array.from(missingFonts).map(font => (
            <li key={font}>{font}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
