import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // FIX: Replaced `process.cwd()` with `''` to resolve TypeScript error `Property 'cwd' does not exist on type 'Process'`.
  // `loadEnv` resolves an empty string path to the current working directory, so functionality is preserved.
  const env = loadEnv(mode, '', '');
  return {
    plugins: [react()],
    define: {
      // Vite replaces env variables, but the code uses process.env.
      // This defines process.env.API_KEY so it's available in the client.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
