import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import {
    TIME_EDIT_LOCAL_PROXY_URL,
    CANVAS_PROXY_URL,
} from './constants/proxyURLS';
import { CANVAS_BASE_URL } from './constants/baseURLS';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react()],
        server: {
            port: env.VITE_PORT || 3000,
            proxy: {
                [TIME_EDIT_LOCAL_PROXY_URL]: {
                    target: 'http://localhost:5033',
                    changeOrigin: true,
                    rewrite: path =>
                        path.replace(TIME_EDIT_LOCAL_PROXY_URL, '/api/v1'),
                },
                [CANVAS_PROXY_URL]: {
                    target: CANVAS_BASE_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(CANVAS_PROXY_URL, '/api/v1'),
                },
            },
        },
    };
});
