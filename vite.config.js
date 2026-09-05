import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const sourcePath = assetInfo.originalFileNames?.[0] ?? assetInfo.name ?? "";
          const portfolioMatch = sourcePath.match(/portfolio\/([^/]+)\//);

          if (sourcePath.includes("src/assets/Global/")) {
            return "assets/Global/[name]-[hash][extname]";
          }

          if (sourcePath.includes("src/assets/Icons/")) {
            return "assets/Icons/[name]-[hash][extname]";
          }

          if (portfolioMatch) {
            return `assets/portfolio/${portfolioMatch[1]}/[name]-[hash][extname]`;
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
