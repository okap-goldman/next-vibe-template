/**
 * 投稿APIエンドポイント
 * 投稿一覧を取得するAPIルート
 */
import { NextRequest, NextResponse } from 'next/server';

import { PostListApiResponse, PostWithUserActions } from '../types';

/**
 * 投稿一覧を取得するGETリクエストハンドラー
 * @param {NextRequest} request - 受信したHTTPリクエスト
 * @returns {NextResponse} 投稿一覧データを含むレスポンス
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
    const mockPosts: PostWithUserActions[] = Array.from({ length: limit }, (_, i) => ({
      id: `post-${cursor ? parseInt(cursor) + i : i}`,
      content: `これはサンプル投稿です。長めの文章も入れてみましょう。これはテスト用のデータなので実際のコンテンツとは異なります。#${cursor ? parseInt(cursor) + i : i}`,
      authorId: `user-${(i % 3) + 1}`,
      authorName: `ユーザー${(i % 3) + 1}`,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      updatedAt: i % 5 === 0 ? new Date(Date.now() - i * 1800000).toISOString() : null,
      imageUrls: i % 4 === 0 ? [`https://picsum.photos/500/300?random=${i}`] : [],
      likes: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.5,
      isSaved: Math.random() > 0.8,
    }));

    const mockResponse: PostListApiResponse = {
      posts: mockPosts,
      totalCount: 100, // 仮の総投稿数
      nextCursor: cursor ? String(parseInt(cursor) + limit) : String(limit),
      hasMore: true,
    };

    // レスポンスの返却
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('投稿一覧API処理エラー:', error);
    return NextResponse.json({ error: '投稿一覧の取得に失敗しました' }, { status: 500 });
  }
};
