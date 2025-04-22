/**
 * タイムライン機能の型定義
 * Timeline機能で使用される型の定義をまとめたファイル
 */

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: number;
  commentCount: number;
}

export interface FeedItem extends Post {
  isLiked: boolean;
}

export interface FeedResponse {
  items: FeedItem[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface UseInfiniteFeedOptions {
  initialCursor?: string;
  limit?: number;
}

export interface UseInfiniteFeedResult {
  feed: FeedItem[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}
