/**
 * 無限スクロール可能なフィードデータを管理するフック
 * ページネーションによるフィード取得とキャッシュを扱う
 */
import { useCallback, useEffect, useState } from 'react';

import { get } from '../../../libs/fetcher';
import type {
  FeedItem,
  FeedResponse,
  UseInfiniteFeedOptions,
  UseInfiniteFeedResult,
} from '../types';

/**
 * タイムラインの無限スクロールを管理するカスタムフック
 * @param {UseInfiniteFeedOptions} options - フィード取得オプション
 * @param {string} [options.initialCursor] - 初期カーソル値
 * @param {number} [options.limit=10] - 一度に取得する投稿数
 * @param limit
 * @param currentCursor
 * @returns {UseInfiniteFeedResult} フィードデータと操作関数
 */
// フィードデータ取得ロジック
const fetchFeedData = async (
  limit: number,
  currentCursor: string | undefined,
): Promise<FeedResponse> => {
  const response = await get<FeedResponse>('/api/timeline', {
    params: {
      limit,
      ...(currentCursor ? { cursor: currentCursor } : {}),
    },
  });
  if (response.error) throw new Error(response.error || 'フィードの取得に失敗しました');
  return response.data as FeedResponse;
};

/**
 * フィードデータ取得用カスタムフック。
 *
 * @param limit - 取得件数
 * @param setFeed - フィードsetter
 * @param setCursor - カーソルsetter
 * @param setHasMore - 続き有無setter
 * @param setIsLoading - ローディングsetter
 * @param setIsError - エラーsetter
 * @returns データ取得関数
 */
const useFetchFeed = (
  limit: number,
  setFeed: React.Dispatch<React.SetStateAction<FeedItem[]>>,
  setCursor: React.Dispatch<React.SetStateAction<string | undefined>>,
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
) =>
  useCallback(
    async (currentCursor?: string, isRefresh: boolean = false): Promise<void> => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await fetchFeedData(limit, currentCursor);
        setFeed((prev) => (isRefresh ? data.items : [...prev, ...data.items]));
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        setIsError(true);
        console.error('フィード取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, setFeed, setCursor, setHasMore, setIsLoading, setIsError],
  );

/**
 * 無限スクロール用フィード取得カスタムフック。
 *
 * @param options - 取得オプション
 * @returns フィード管理結果
 */
export const useInfiniteFeed = (options: UseInfiniteFeedOptions = {}): UseInfiniteFeedResult => {
  const { initialCursor, limit = 10 } = options;
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);

  const fetchFeed = useFetchFeed(limit, setFeed, setCursor, setHasMore, setIsLoading, setIsError);

  useEffect(() => {
    void fetchFeed(initialCursor);
  }, [fetchFeed, initialCursor]);

  const loadMore = useCallback((): void => {
    if (!isLoading && hasMore) {
      void fetchFeed(cursor);
    }
  }, [fetchFeed, isLoading, hasMore, cursor]);

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
