import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'bunx next dev',
    port: 3000,
    reuseExistingServer: !process.env['CI'],

    timeout: 120 * 1000,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  globalSetup: './tests/global-setup.ts',
});
