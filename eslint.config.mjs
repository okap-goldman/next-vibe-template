// eslint.config.mjs
// このファイルはNext.js/TypeScriptプロジェクトのESLint設定責務を担う
// TypeScript開発ガイドに基づき、JSDoc・命名規則・型安全・品質向上ルールを強化

import js from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import next from '@next/eslint-plugin-next';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsdoc from 'eslint-plugin-jsdoc';
// import prettier from 'eslint-config-prettier'; // prettier連携は一時停止中

const tsRecommended = Array.isArray(tseslint.configs.recommended)
  ? tseslint.configs.recommended.filter(Boolean)
  : [tseslint.configs.recommended].filter(Boolean);

const tsTypeChecking = Array.isArray(tseslint.configs.recommendedRequiringTypeChecking)
  ? tseslint.configs.recommendedRequiringTypeChecking.filter(Boolean)
  : [tseslint.configs.recommendedRequiringTypeChecking].filter(Boolean);

export default [
  {
    // .eslintignoreの内容は本プロパティへ移行済み（ESLint v9対応）
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
      'build/',
      'out/',
      'coverage/',
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
      '*.rc.js',
      '*.rc.cjs',
      '*.rc.mjs',
      '*.d.ts',
      'scripts/',
      '.env*',
      // 設定ファイル・ルート直下のdotfileも除外
      '.commitlintrc.cjs',
      '.eslintrc.*',
      '.prettierrc.*',
      '.stylelintrc.*',
      '*.test.*',
      '*.spec.*',
      '*.json',
      // TypeScript設定ファイルも除外
      '*.config.ts',
      '*.api.config.ts',
      '*-ct.config.ts',
      'playwright.config.ts',
      'playwright-ct.config.ts',
      'vitest.config.ts',
      'vitest.api.config.ts',
    ],
  },
  js.configs.recommended,
  ...tsRecommended,
  ...tsTypeChecking,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      jsdoc,
      next,
    },
    rules: {
      // JSDoc必須・内容チェック
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
            ClassDeclaration: true,
          },
        },
      ],
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'warn',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/require-description': 'warn',
      // 命名規則
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
      ],
      // any禁止
      '@typescript-eslint/no-explicit-any': 'error',
      // 関数本体20行以内
      'max-lines-per-function': ['error', { max: 40, skipComments: true, skipBlankLines: true }],
      // ネスト3レベル以内
      'max-depth': ['error', 3],
      // マジックナンバー禁止
      'no-magic-numbers': [
        'warn',
        {
          ignore: [0, 1, -1, 3, 10, 100, 1000],
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],
      // ファイル500行以内
      'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
      // アロー関数のみ許可
      'func-style': 'off',
      // 未使用import削除
      'unused-imports/no-unused-imports': 'error',
      // import順自動整列
      'simple-import-sort/imports': 'error',
      // Error型のみthrow許可
      '@typescript-eslint/only-throw-error': 'error',
      // console.error/errorだけ許可（開発時はerror、本番はerror）
      'no-console':
        process.env.NODE_ENV === 'production' ? 'error' : ['error', { allow: ['warn', 'error'] }],
      // baseルール競合無効化
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
];
