import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      // Proxy Supabase requests in local dev so DNS issues don't affect development either
      proxy: env.VITE_SUPABASE_URL
        ? {
            '/supabase-proxy': {
              target: env.VITE_SUPABASE_URL,
              changeOrigin: true,
              rewrite: (path: string) => path.replace(/^\/supabase-proxy/, ''),
            },
          }
        : undefined,
    },
  };
})
