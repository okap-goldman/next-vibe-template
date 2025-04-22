import '@testing-library/jest-dom/vitest';

/**
 * テスト環境をセットアップします。
 * @returns {void}
 */
export function setupTests() {}

/**
 * fetchのグローバルモックを提供します。
 * @returns {Promise<Response>}
 */
global.fetch = async () =>
  new Response(
    JSON.stringify({
      items: [
        { id: 1, content: 'First Post' },
        { id: 2, content: 'Second Post' },
        { id: 3, content: 'Third Post' },
      ],
      nextCursor: null,
      hasMore: false,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
