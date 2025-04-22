/**
 * タイムラインAPIエンドポイント
 * タイムラインのフィードデータを取得するAPIルート
 */
import { NextRequest, NextResponse } from 'next/server';

import type { FeedResponse } from '../types';

/**
 * タイムラインデータを取得するGETリクエストハンドラー
 * @param {NextRequest} request - 受信したHTTPリクエスト
 * @returns {NextResponse} フィードデータを含むレスポンス
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // URLクエリパラメータの取得
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // ここでは仮のデータを返しますが、実際の実装では
    // データベースやAPI呼び出しを行います
    const HOUR_MS = 3600000;
    const MAX_COMMENTS = 20;
    const LIKED_THRESHOLD = 0.5;

    const mockData: FeedResponse = {
      items: Array.from({ length: limit }, (_, i) => ({
        id: `post-${cursor ? parseInt(cursor) + i : i}`,
        content: `これはサンプル投稿です。#${cursor ? parseInt(cursor) + i : i}`,
        authorId: `user-${(i % 3) + 1}`,
        authorName: `ユーザー${(i % 3) + 1}`,
        createdAt: new Date(Date.now() - i * HOUR_MS).toISOString(),
        likes: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * MAX_COMMENTS),
        isLiked: Math.random() > LIKED_THRESHOLD,
      })),
      nextCursor: cursor ? String(parseInt(cursor) + limit) : String(limit),
      hasMore: true,
    };

    // レスポンスの返却
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('タイムラインAPI処理エラー:', error);
    return NextResponse.json({ error: 'タイムラインデータの取得に失敗しました' }, { status: 500 });
  }
};
