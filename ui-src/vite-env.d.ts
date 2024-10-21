/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module ViteEnv {
  interface ImportMetaEnv {
    VITE_NR_ACCOUNT_ID: string;
    VITE_NR_TRUST_KEY: string;
    VITE_NR_AGENT_ID: string;
    VITE_NR_LICENSE_KEY: string;
    VITE_NR_APPLICATION_ID: string;
  }
}
