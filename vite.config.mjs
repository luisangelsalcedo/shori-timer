import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    server:{
        port: 3000,
        host: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'es2020', // soporta top-level await si lo necesitas
        rollupOptions: {
        input: {
            background: resolve(__dirname, 'src/background.js'),
            content: resolve(__dirname, 'src/content.js')
        },
        output: {
            entryFileNames: '[name].js',
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]'
        }
        }
    }
});
