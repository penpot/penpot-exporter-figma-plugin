import type { JSX } from 'preact';
import { useState } from 'preact/hooks';

import styles from './AppFooter.module.css';

declare const APP_VERSION: string;

const AppFooter = (): JSX.Element => {
  const [showVersion, setShowVersion] = useState(false);

  return (
    <div className={styles.footer}>
      <button
        onClick={() => setShowVersion(!showVersion)}
        className={styles['version-button']}
        title="Version info"
      >
        ?
      </button>

      {/* Version modal */}
      {showVersion && (
        <div className={styles['version-modal']}>
          <div className={styles['version-title']}>Version</div>
          <div className={styles['version-text']}>v{APP_VERSION}</div>
        </div>
      )}
    </div>
  );
};

export { AppFooter };
