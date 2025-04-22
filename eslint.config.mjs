// eslint.config.mjs (strict+)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // 1. Global ignores
  {
    ignores: ['node_modules/', '.next/', 'dist/'],
  },

  // 2. Base JS rules
  js.configs.recommended,

  // 3. JS/CJS files (Node env)
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // 4. TS recommended rules
  ...tseslint.configs.recommended,

  // 5. TS type‑aware rules
  {
    ...tseslint.configs.recommendedRequiringTypeChecking,
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // 6. React / Next configs + custom rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, React: 'writable' },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // --- Import / unused -----
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
        },
      ],
      // Ensure base rule is disabled when using ts version
      // 下記2つは他のルールで代用しているためoffでOK
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // Disable explicitly to avoid conflict with unused-imports

      // --- Console ---
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // --- React / Hooks ---
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      // これらは他のルールで代用しているためoffでOK
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-literals': 'off', // Disable this rule

      // --- Next.js ---
      ...nextPlugin.configs.recommended.rules,

      // --- TypeScript extras ---
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },

  // 7. Prettier (last)
  prettierConfig,
];
