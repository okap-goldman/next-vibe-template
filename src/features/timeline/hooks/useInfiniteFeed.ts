/**
 * 無限スクロール可能なフィードデータを管理するフック
 * ページネーションによるフィード取得とキャッシュを扱う
 */
import { useCallback, useEffect, useState } from 'react';

import { get } from '../../../libs/fetcher';
import { FeedItem, FeedResponse, UseInfiniteFeedOptions, UseInfiniteFeedResult } from '../types';

/**
 * タイムラインの無限スクロールを管理するカスタムフック
 * @param {UseInfiniteFeedOptions} options - フィード取得オプション
 * @param {string} [options.initialCursor] - 初期カーソル値
 * @param {number} [options.limit=10] - 一度に取得する投稿数
 * @returns {UseInfiniteFeedResult} フィードデータと操作関数
 */
export const useInfiniteFeed = (options: UseInfiniteFeedOptions = {}): UseInfiniteFeedResult => {
  const { initialCursor, limit = 10 } = options;

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);

  /**
   * フィードデータを取得する関数
   * @param {string | undefined} currentCursor - ページネーションカーソル
   * @param {boolean} isRefresh - リフレッシュの場合はtrue
   */
  const fetchFeed = useCallback(
    async (currentCursor?: string, isRefresh: boolean = false): Promise<void> => {
      if (isLoading) return;

      setIsLoading(true);
      setIsError(false);

      try {
        // fetcherユーティリティを使用してAPIからデータ取得
        const response = await get<FeedResponse>('/api/timeline', {
          params: {
            limit,
            ...(currentCursor ? { cursor: currentCursor } : {}),
          },
        });

        if (response.error) {
          throw new Error(response.error || 'フィードの取得に失敗しました');
        }

        const data = response.data as FeedResponse;

        // 状態の更新
        setFeed((prev: FeedItem[]) => (isRefresh ? data.items : [...prev, ...data.items]));
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        setIsError(true);
        console.error('フィード取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, limit],
  );

  // 初回ロード時にフィードを取得
  useEffect(() => {
    void fetchFeed(initialCursor);
  }, [fetchFeed, initialCursor]);

  /**
   * さらにフィードを読み込む関数
   */
  /**
   * さらにフィードを読み込む関数
   * @returns {void}
   */
  const loadMore = useCallback((): void => {
    if (!isLoading && hasMore) {
      void fetchFeed(cursor);
    }
  }, [fetchFeed, isLoading, hasMore, cursor]);

  /**
   * フィードをリフレッシュする関数
   */
  /**
   * フィードをリフレッシュする関数
   * @returns {void}
   */
  const refresh = useCallback((): void => {
    void fetchFeed(undefined, true);
  }, [fetchFeed]);

  return {
    feed,
    isLoading,
    isError,
    hasMore,
    loadMore,
    refresh,
  };
};
