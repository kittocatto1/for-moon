import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps every asset path relative, so the build works on
// GitHub Pages (which serves from /for-moon/), Firebase, Netlify, anywhere.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
