'use client';
import type { JSX } from 'react';

/**
 * タイムラインフィードを表示するコンポーネント
 * 投稿の一覧を無限スクロール形式で表示する
 */
import { useInfiniteFeed } from '../hooks/useInfiniteFeed';
import type { FeedItem } from '../types';

/**
 * タイムラインフィードコンポーネント
 * @param root0
 * @param root0.item
 * @returns {JSX.Element} タイムラインフィードを表示するUI要素
 */
const FeedItemCard: React.FC<{ item: FeedItem }> = ({ item }) => (
  <article className="p-4 border rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-medium text-gray-900">{item.authorName}</h3>
      <span className="text-xs text-gray-500">
        {new Date(item.createdAt).toLocaleDateString('ja-JP')}
      </span>
    </div>
    <p className="text-gray-700 mb-3">{item.content}</p>
    <div className="flex items-center text-sm text-gray-500 space-x-4">
      <button
        className={`flex items-center space-x-1 ${item.isLiked ? 'text-pink-500' : ''}`}
        aria-label="いいね"
      >
        <span>{item.isLiked ? '❤️' : '🤍'}</span>
        <span>{item.likes}</span>
      </button>
      <span className="flex items-center space-x-1">
        <span>💬</span>
        <span>{item.commentCount}</span>
      </span>
    </div>
  </article>
);

/**
 * 投稿読み込み失敗時のエラー表示コンポーネント。
 *
 * @param root0 - props
 * @param root0.onRetry - 再試行ハンドラ
 * @returns エラー表示要素
 */
const FeedError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="p-4 border rounded-lg bg-red-50 text-red-500">
    <p>投稿の読み込みに失敗しました。</p>
    <button
      onClick={onRetry}
      className="mt-2 px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
    >
      再試行
    </button>
  </div>
);

/**
 * フィード読み込み中表示コンポーネント。
 *
 * @returns ローディング表示要素
 */
const FeedLoading: React.FC = () => (
  <div className="py-4 text-center">
    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
    <p className="mt-2 text-gray-500">読み込み中...</p>
  </div>
);

/**
 * フィードの「もっと見る」ボタンコンポーネント。
 *
 * @param root0 - props
 * @param root0.onClick - クリックハンドラ
 * @returns ボタン表示要素
 */
const LoadMoreButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="text-center pt-4">
    <button
      onClick={onClick}
      className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
    >
      もっと見る
    </button>
  </div>
);

/**
 * フィード一覧コンポーネント。
 *
 * @returns フィード表示要素
 */
export const Feed = (): JSX.Element => {
  const { feed, isLoading, isError, hasMore, loadMore, refresh } = useInfiniteFeed({ limit: 5 });

  if (isError) {
    return <FeedError onRetry={refresh} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">タイムライン</h1>
        <button
          onClick={refresh}
          className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
          aria-label="更新"
        >
          更新
        </button>
      </div>

      {feed.length === 0 && !isLoading ? (
        <p className="text-gray-500 text-center py-8">投稿がありません</p>
      ) : (
        <div className="space-y-2">
          {feed.map((item) => (
            <FeedItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {isLoading && <FeedLoading />}

      {hasMore && !isLoading && <LoadMoreButton onClick={loadMore} />}
    </div>
  );
};
