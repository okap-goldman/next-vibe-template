/**
 * 投稿カードコンポーネント
 * 単一の投稿情報を表示するカードUI
 */
'use client';
import Image from 'next/image'; // Add import
import type { JSX } from 'react';
import { useState } from 'react';

import { timeAgo } from '../../../libs/date';
import type { PostWithUserActions } from '../types';

/**
 * PostCardコンポーネントのプロパティ
 */
export interface PostCardProps {
  /**
   * 表示する投稿データ
   */
  post: PostWithUserActions;

  /**
   * いいねボタンクリック時のハンドラー
   */
  onLikeClick?: (postId: string) => void;

  /**
   * コメントボタンクリック時のハンドラー
   */
  onCommentClick?: (postId: string) => void;

  /**
   * シェアボタンクリック時のハンドラー
   */
  onShareClick?: (postId: string) => void;

  /**
   * 投稿をクリックした時の詳細表示ハンドラー
   */
  onPostClick?: (postId: string) => void;
}

/**
 * 投稿カードコンポーネント
 * @param {PostCardProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} 投稿カード要素
 */
export const PostCard = ({
  post,
  onLikeClick,
  onCommentClick,
  onShareClick,
  onPostClick,
}: PostCardProps): JSX.Element => {
  const [isImageExpanded, setIsImageExpanded] = useState<boolean>(false);

  /**
   * いいねボタンのクリックハンドラー
   */
  const handleLikeClick = (): void => {
    if (onLikeClick) {
      onLikeClick(post.id);
    }
  };

  /**
   * コメントボタンのクリックハンドラー
   */
  const handleCommentClick = (): void => {
    if (onCommentClick) {
      onCommentClick(post.id);
    }
  };

  /**
   * シェアボタンのクリックハンドラー
   */
  const handleShareClick = (): void => {
    if (onShareClick) {
      onShareClick(post.id);
    }
  };

  /**
   * 投稿カードのクリックハンドラー
   */
  const handlePostClick = (): void => {
    if (onPostClick) {
      onPostClick(post.id);
    }
  };

  /**
   * 画像クリックのハンドラー
   * @param {React.MouseEvent} e - クリックイベント
   */
  const handleImageClick = (e: React.MouseEvent): void => {
    e.stopPropagation(); // 親要素へのクリックイベントの伝播を防止
    setIsImageExpanded(!isImageExpanded);
  };

  return (
    <article
      className="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handlePostClick}
    >
      {/* 投稿ヘッダー */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
            {/* ユーザーアイコンの代替表示 */}
            <span className="text-gray-500 text-sm">{post.authorName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
            <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {/* 投稿メニュー（省略） */}
        <button className="text-gray-400 hover:text-gray-600">
          <span>⋯</span>
        </button>
      </div>

      {/* 投稿コンテンツ */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>

      {/* 投稿画像（ある場合） */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mb-4">
          <div
            className={`relative rounded-lg overflow-hidden cursor-zoom-in ${
              isImageExpanded
                ? 'fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4'
                : ''
            }`}
            onClick={handleImageClick}
          >
            <Image
              src={post.imageUrls[0] ?? ''}
              alt="投稿画像"
              fill
              className={`${isImageExpanded ? 'max-h-screen max-w-full object-contain' : 'w-full h-auto object-cover'}`}
            />
            {post.imageUrls.length > 1 && !isImageExpanded && (
              <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                +{post.imageUrls.length - 1}
              </div>
            )}
          </div>
        </div>
      )}

      {/* いいね・コメント数 */}
      <div className="flex justify-between text-xs text-gray-500 mb-3">
        <div>{post.likes > 0 ? `${post.likes}件のいいね` : ''}</div>
        <div>{post.commentCount > 0 ? `コメント${post.commentCount}件` : ''}</div>
      </div>

      {/* アクションボタン */}
      <div className="flex border-t border-gray-100 pt-3">
        <button
          className={`flex-1 flex items-center justify-center py-1 ${post.isLiked ? 'text-pink-500' : 'text-gray-500'} hover:bg-gray-50 rounded-md`}
          onClick={handleLikeClick}
        >
          <span className="mr-1">{post.isLiked ? '❤️' : '🤍'}</span>
          <span>いいね</span>
        </button>

        <button
          className="flex-1 flex items-center justify-center py-1 text-gray-500 hover:bg-gray-50 rounded-md"
          onClick={handleCommentClick}
        >
          <span className="mr-1">💬</span>
          <span>コメント</span>
        </button>

        <button
          className="flex-1 flex items-center justify-center py-1 text-gray-500 hover:bg-gray-50 rounded-md"
          onClick={handleShareClick}
        >
          <span className="mr-1">🔄</span>
          <span>シェア</span>
        </button>
      </div>
    </article>
  );
};
