import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  // Prevent Vite from trying to pre-bundle three.js browser-only internals
  optimizeDeps: {
    exclude: ["@react-three/fiber", "@react-three/drei", "three"],
  },
  ssr: {
    // Don't attempt to SSR three.js or R3F
    noExternal: [],
    external: ["three", "@react-three/fiber", "@react-three/drei"],
  },
});
