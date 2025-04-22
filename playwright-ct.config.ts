import { defineConfig } from '@playwright/experimental-ct-react';
import { devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/components',
  use: {
    ctPort: 3100,
    ctViteConfig: {
      plugins: [],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
