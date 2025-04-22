/**
 * Vitest 設定ファイル
 * Vite/Vitestの依存バージョン競合を避けるため、testプロパティを統合
 */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts', './tests/setup.ts'],
    coverage: { reporter: ['text', 'html'] },
  },
});
