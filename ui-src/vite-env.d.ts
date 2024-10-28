/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module ViteEnv {
  interface ImportMetaEnv {
    VITE_SENTRY_DSN: string;
    VITE_MIXPANEL_TOKEN: string;
  }
}

declare const APP_VERSION: string;
