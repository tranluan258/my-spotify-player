/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_CLIENT_ID: string;
  VITE_REDIRECT_URI: string;
  VITE_AUTH_ENDPOINT: string;
  VITE_SCOPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
