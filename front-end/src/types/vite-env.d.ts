// vite-env.d.ts
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // add other environment variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  