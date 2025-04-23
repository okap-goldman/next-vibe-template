/**
 * 投稿APIエンドポイント
 * 投稿一覧を取得するAPIルート
 */
import { NextRequest, NextResponse } from 'next/server';

import type { PostListApiResponse, PostWithUserActions } from '../types';

/**
 * 投稿一覧を取得するGETリクエストハンドラー
 * @param {NextRequest} request - 受信したHTTPリクエスト
 * @returns {NextResponse} 投稿一覧データを含むレスポンス
 */
// マジックナンバー定数
const DEFAULT_LIMIT = 10;
const AUTHOR_VARIATION = 3;
const IMAGE_VARIATION = 4;
const HOUR_MS = 3600000;
const HALF_HOUR_MS = 1800000;
const TOTAL_COUNT = 100;
const UPDATED_INTERVAL = 5;
const MAX_LIKES = 100;
const MAX_COMMENTS = 20;

/**
 * モック投稿データ生成
 * @param {number} limit - 取得件数
 * @param {string|null} cursor - カーソル
 * @returns {PostWithUserActions[]} 投稿データ配列
 */
const IS_LIKED_THRESHOLD = 0.5;
const IS_SAVED_THRESHOLD = 0.8;

/**
 * 指定した件数分のモック投稿データを生成する
 * @param limit 生成する投稿数
 * @param cursor カーソル（ページネーション用）
 * @returns モック投稿データ配列
 */
const generateMockPosts = (limit: number, cursor: string | null): PostWithUserActions[] =>
  Array.from({ length: limit }, (_, i) => ({
    id: `post-${cursor ? parseInt(cursor) + i : i}`,
    content: `これはサンプル投稿です。長めの文章も入れてみましょう。これはテスト用のデータなので実際のコンテンツとは異なります。#${cursor ? parseInt(cursor) + i : i}`,
    authorId: `user-${(i % AUTHOR_VARIATION) + 1}`,
    authorName: `ユーザー${(i % AUTHOR_VARIATION) + 1}`,
    createdAt: new Date(Date.now() - i * HOUR_MS).toISOString(),
    updatedAt:
      i % UPDATED_INTERVAL === 0 ? new Date(Date.now() - i * HALF_HOUR_MS).toISOString() : null,
    imageUrls: i % IMAGE_VARIATION === 0 ? [`https://picsum.photos/500/300?random=${i}`] : [],
    likes: Math.floor(Math.random() * MAX_LIKES),
    commentCount: Math.floor(Math.random() * MAX_COMMENTS),
    isLiked: Math.random() > IS_LIKED_THRESHOLD,
    isSaved: Math.random() > IS_SAVED_THRESHOLD,
  }));

/**
 * 投稿一覧を取得するGETリクエストハンドラー
 * @param {NextRequest} request - 受信したHTTPリクエスト
 * @returns {Promise<NextResponse>} 投稿一覧データを含むレスポンス
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;
    const mockPosts = generateMockPosts(limit, cursor);
    const mockResponse: PostListApiResponse = {
      posts: mockPosts,
      totalCount: TOTAL_COUNT,
      nextCursor: cursor ? String(parseInt(cursor) + limit) : String(limit),
      hasMore: true,
    };
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('投稿一覧API処理エラー:', error);
    return NextResponse.json({ error: '投稿一覧の取得に失敗しました' }, { status: 500 });
  }
};
