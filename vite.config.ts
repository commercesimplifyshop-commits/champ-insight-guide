import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
    // Proxy /api requests to the backend during local development.
    proxy: {
      '/api': {
        // Use HTTPS by default to avoid backend redirecting HTTP -> HTTPS and
        // converting POST requests to GET. You can still override this with
        // VITE_API_PROXY_TARGET if needed (e.g. http://host.docker.internal).
        target: process.env.VITE_API_PROXY_TARGET || 'https://localhost',
        changeOrigin: true,
        secure: false,
        // Do not rewrite the path so /api/* forwards as-is
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
