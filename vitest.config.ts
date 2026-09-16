import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
      environment: "happy-dom",
      restoreMocks: true,

      coverage: {
        enabled: true,
        include: ["src/**"],
        reporter: ["text", "text-summary", "lcov"],
      },

      server: {
        deps: {
          inline: [
            // workaround for 'Unknown file extension ".css"'
            // See https://github.com/vitest-dev/vitest/discussions/6138
          ],
        },
      },
    },
  }),
);
