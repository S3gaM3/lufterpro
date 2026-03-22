/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
  readonly VITE_RATE_LIMIT_RESET_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
