/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0284c7',  // sky-600
                secondary: '#0ea5e9', // sky-500
                accent: '#38bdf8',   // sky-400
                light: '#f0f9ff',    // sky-50
                dark: '#0f172a',     // slate-900
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            boxShadow: {
                'glow': '0 0 15px 2px rgba(56, 189, 248, 0.3)',
            },
        },
    },
    plugins: [],
}
