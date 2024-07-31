import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { UserConfig as VitestUserConfig } from "vitest/config";

interface UserConfig extends VitestUserConfig {
  test: {
    globals: boolean;
    environment: string;
    setupFiles: string | string[];
  };
}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    reporters: ["default", "html"],
  },
} as UserConfig);
