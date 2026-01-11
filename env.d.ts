
// Fix: Augment global NodeJS namespace to provide types for process.env
// This resolves "Duplicate identifier 'process'" and "Statements are not allowed in ambient contexts"
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
