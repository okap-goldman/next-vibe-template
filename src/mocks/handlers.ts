import { http } from 'msw';

const HTTP_OK = 200;

export const handlers = [
  // タイムラインAPIのダミーレスポンス
  http.get('/api/posts', () => {
    return new Response(
      JSON.stringify([
        { id: 1, content: 'mock post 1' },
        { id: 2, content: 'mock post 2' },
        { id: 3, content: 'mock post 3' },
      ]),
      {
        status: HTTP_OK,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }),
];
