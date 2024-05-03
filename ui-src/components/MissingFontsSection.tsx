import { useFormContext } from 'react-hook-form';

type MissingFontsSectionProps = {
  fonts?: string[];
};

export const MissingFontsSection = ({ fonts }: MissingFontsSectionProps) => {
  const { register } = useFormContext();

  if (fonts === undefined || !fonts.length) return;

  return (
    <section className="missing-fonts-section">
      <div className="missing-fonts-header">
        {fonts.length} missing font{fonts.length > 1 ? 's' : ''}:{' '}
      </div>
      <small className="font-install-message">
        Ensure fonts are installed in Penpot before exporting.
      </small>
      <div className="missing-fonts-list">
        {fonts.map(font => (
          <div key={font} className="font-input-row">
            <span className="font-name">{font}</span>
            <input
              className="font-id-input"
              placeholder="Enter Penpot font id"
              {...register(font)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
