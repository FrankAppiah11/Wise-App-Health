import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Use process.env so Vercel (and other hosts) inject vars at build time; fallback to .env files
    const supabaseUrl = process.env.SUPABASE_URL ?? env.SUPABASE_URL ?? env.VITE_SUPABASE_URL ?? '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_ANON_KEY ?? '';
    const geminiKey = process.env.GEMINI_API_KEY ?? env.GEMINI_API_KEY ?? '';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(geminiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
        'process.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
        'process.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
