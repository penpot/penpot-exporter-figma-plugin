import { useFormContext } from 'react-hook-form';

type MissingFontsSectionProps = {
  fonts?: string[];
};

export const MissingFontsSection = ({ fonts }: MissingFontsSectionProps) => {
  const { register } = useFormContext();

  if (fonts === undefined || !fonts.length) return;

  return (
    <section>
      <div id="missing-fonts">
        {fonts.length} missing font
        {fonts.length > 1 ? 's' : ''}:{' '}
      </div>
      <small>Ensure fonts are installed in Penpot before exporting.</small>
      <div id="missing-fonts-list">
        <ul>
          {fonts.map(font => (
            <li key={font}>
              {font}
              <input placeholder="Enter font name" {...register(font)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
