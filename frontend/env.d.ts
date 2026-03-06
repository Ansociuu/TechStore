/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


// Fix: Augment global NodeJS namespace to provide types for process.env
// This resolves "Duplicate identifier 'process'" and "Statements are not allowed in ambient contexts"
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
