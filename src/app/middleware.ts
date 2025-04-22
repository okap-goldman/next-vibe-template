/**
 * Next.js Edge Middleware
 * 認証チェック、リダイレクト、ABテスト、i18nなどの処理を実装
 */
import { NextResponse } from 'next/server';

/**
 * Middleware関数
 * リクエストごとに実行され、レスポンスを操作したり、ルーティングを制御したりする
 * @returns {NextResponse | undefined} 次のレスポンスまたは undefined
 */
export const middleware = (): NextResponse | undefined => {
  // 例: 特定のパスへのアクセスを制限する場合
  // if (_request.nextUrl.pathname.startsWith('/admin')) {
  //   // 認証チェックなどのロジック
  // }

  return NextResponse.next();
};

// Middlewareを適用するパスを指定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
