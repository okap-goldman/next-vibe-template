/**
 * ヘルスチェックAPIエンドポイント (`/api/health`)
 * アプリケーションの動作状況を確認するために使用される
 */
import { NextResponse } from 'next/server';

/**
 * GETリクエストハンドラ
 * @returns {Promise<NextResponse>} ヘルスチェックの結果を含むレスポンス
 */
export const GET = async (): Promise<NextResponse> => {
  // ここでデータベース接続や外部サービスの疎通確認などを行うことも可能
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
};
