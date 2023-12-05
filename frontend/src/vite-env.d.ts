/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CANVAS_USER_ID: string;
    readonly VITE_CANVAS_CONTEXT_CODE: string;
    readonly VITE_CANVAS_AUTH_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
