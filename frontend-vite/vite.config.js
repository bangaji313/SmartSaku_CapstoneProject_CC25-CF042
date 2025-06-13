// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Base path dimana aplikasi akan di-deploy
    base: '/',

    // Konfigurasi build
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'terser',
        sourcemap: true,
    },

    // Menggunakan resolve untuk menyederhanakan import
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@css': resolve(__dirname, 'src/css'),
            '@js': resolve(__dirname, 'src/js'),
            '@images': resolve(__dirname, 'src/images'),
            '@templates': resolve(__dirname, 'src/templates'),
        },
    },    // Konfigurasi server development
    server: {
        port: 3001,
        open: true, // Buka browser otomatis
        proxy: {
            '/api': {
                target: 'http://202.10.35.227',
                changeOrigin: true,
                secure: false
            }
        }
    },

    // Konfigurasi untuk import file HTML sebagai string
    assetsInclude: ['**/*.html'],

    // Plugin untuk Vite
    plugins: [],

    css: {
        postcss: {
            plugins: []
        }
    }
});
