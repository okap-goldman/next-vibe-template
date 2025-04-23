/**
 * 投稿カードコンポーネント
 * 単一の投稿情報を表示するカードUI
 */
'use client';
// Add import
import type { JSX } from 'react';
import { useState } from 'react';

import type { PostWithUserActions } from '../types';

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
 * 投稿カード用のハンドラ群をまとめるカスタムフック
 * @param {PostWithUserActions} post - 投稿データ
 * @param {(id: string) => void} [onLikeClick] - いいねハンドラ
 * @param {(id: string) => void} [onCommentClick] - コメントハンドラ
 * @param {(id: string) => void} [onShareClick] - シェアハンドラ
 * @param {(id: string) => void} [onPostClick] - 投稿クリックハンドラ
 * @returns {PostCardHandlers} 各種ハンドラと状態
 */
interface PostCardHandlers {
  isImageExpanded: boolean;
  handleLikeClick: () => void;
  handleCommentClick: (e: React.MouseEvent) => void;
  handleShareClick: (e: React.MouseEvent) => void;
  handlePostClick: () => void;
  handleImageClick: (e: React.MouseEvent) => void;
}

/**
 * 投稿カードの各種イベントハンドラをまとめて生成するカスタムフック。
 *
 * @param post - 投稿データ
 * @param onLikeClick - いいねクリック時のコールバック
 * @param onCommentClick - コメントクリック時のコールバック
 * @param onShareClick - シェアクリック時のコールバック
 * @param onPostClick - 投稿クリック時のコールバック
 * @returns 投稿カード用ハンドラ群
 */
/**
 * 投稿カードの各種ハンドラと状態を生成するカスタムフック
 * @param post 投稿データ
 * @param onLikeClick いいねハンドラ
 * @param onCommentClick コメントハンドラ
 * @param onShareClick シェアハンドラ
 * @param onPostClick 投稿クリックハンドラ
 * @returns {PostCardHandlers} 投稿カードのハンドラ群と状態
 */
import { useCallback } from 'react';

/**
 * 投稿の「いいね」クリックイベントハンドラを生成するファクトリ関数。
 *
 * @param post - 投稿データ
 * @param onLikeClick - いいねクリック時のコールバック
 * @returns クリックイベントハンドラ
 */
const handleLikeClickFactory = (post: PostWithUserActions, onLikeClick?: (id: string) => void) =>
  useCallback(() => {
    onLikeClick?.(post.id);
  }, [onLikeClick, post.id]);

/**
 * 投稿の「コメント」クリックイベントハンドラを生成するファクトリ関数。
 *
 * @param post - 投稿データ
 * @param onCommentClick - コメントクリック時のコールバック
 * @returns クリックイベントハンドラ
 */
const handleCommentClickFactory = (
  post: PostWithUserActions,
  onCommentClick?: (id: string) => void,
) =>
  useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onCommentClick?.(post.id);
    },
    [onCommentClick, post.id],
  );

/**
 * 投稿の「シェア」クリックイベントハンドラを生成するファクトリ関数。
 *
 * @param post - 投稿データ
 * @param onShareClick - シェアクリック時のコールバック
 * @returns クリックイベントハンドラ
 */
const handleShareClickFactory = (post: PostWithUserActions, onShareClick?: (id: string) => void) =>
  useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onShareClick?.(post.id);
    },
    [onShareClick, post.id],
  );

/**
 * 投稿の「投稿本体」クリックイベントハンドラを生成するファクトリ関数。
 *
 * @param post - 投稿データ
 * @param onPostClick - 投稿クリック時のコールバック
 * @returns クリックイベントハンドラ
 */
const handlePostClickFactory = (post: PostWithUserActions, onPostClick?: (id: string) => void) =>
  useCallback(() => {
    onPostClick?.(post.id);
  }, [onPostClick, post.id]);

/**
 * 投稿画像の拡大・縮小トグル用クリックハンドラを生成するファクトリ関数。
 *
 * @param setIsImageExpanded - 画像拡大状態のsetter
 * @returns クリックイベントハンドラ
 */
const handleImageClickFactory = (
  setIsImageExpanded: React.Dispatch<React.SetStateAction<boolean>>,
) =>
  useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsImageExpanded((prev) => !prev);
    },
    [setIsImageExpanded],
  );

/**
 * 投稿カードの各種イベントハンドラをまとめて生成するカスタムフック。
 *
 * @param post - 投稿データ
 * @param onLikeClick - いいねクリック時のコールバック
 * @param onCommentClick - コメントクリック時のコールバック
 * @param onShareClick - シェアクリック時のコールバック
 * @param onPostClick - 投稿クリック時のコールバック
 * @returns 投稿カード用ハンドラ群
 */
const usePostCardHandlers = (
  post: PostWithUserActions,
  onLikeClick?: (id: string) => void,
  onCommentClick?: (id: string) => void,
  onShareClick?: (id: string) => void,
  onPostClick?: (id: string) => void,
): PostCardHandlers => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  return {
    isImageExpanded,
    handleLikeClick: handleLikeClickFactory(post, onLikeClick),
    handleCommentClick: handleCommentClickFactory(post, onCommentClick),
    handleShareClick: handleShareClickFactory(post, onShareClick),
    handlePostClick: handlePostClickFactory(post, onPostClick),
    handleImageClick: handleImageClickFactory(setIsImageExpanded),
  };
};

/**
 * 投稿カードコンポーネント
 * @param {PostCardProps} props - 投稿カードのプロパティ
 * @returns {JSX.Element} 投稿カード要素
 */
export const PostCard = ({
  post,
  onLikeClick,
  onCommentClick,
  onShareClick,
  onPostClick,
}: PostCardProps): JSX.Element => {
  const handlers = usePostCardHandlers(
    post,
    onLikeClick,
    onCommentClick,
    onShareClick,
    onPostClick,
  );
  return <PostCardMainLayout post={post} {...handlers} />;
};

/**
 * 投稿カードのレイアウト本体
 * @param {PostCardMainLayoutProps} props - レイアウトプロパティ
 * @returns {JSX.Element} レイアウト要素
 */
interface PostCardMainLayoutProps {
  post: PostWithUserActions;
  isImageExpanded: boolean;
  handleLikeClick: (e: React.MouseEvent) => void;
  handleCommentClick: (e: React.MouseEvent) => void;
  handleShareClick: (e: React.MouseEvent) => void;
  handlePostClick: (e: React.MouseEvent) => void;
  handleImageClick: (e: React.MouseEvent) => void;
}

/**
 * 投稿カードのメインレイアウト
 * @param {PostCardMainLayoutProps} props
 * @returns {JSX.Element} 投稿カード要素
 */
/**
 * 投稿カードのメインレイアウトコンポーネント
 * @param props レイアウトプロパティ
 * @param props.post
 * @param props.isImageExpanded
 * @param props.handleLikeClick
 * @param props.handleCommentClick
 * @param props.handleShareClick
 * @param props.handlePostClick
 * @param props.handleImageClick
 * @returns {JSX.Element} 投稿カード要素
 */
const PostCardMainLayout = ({
  post,
  isImageExpanded,
  handleLikeClick,
  handleCommentClick,
  handleShareClick,
  handlePostClick,
  handleImageClick,
}: PostCardMainLayoutProps): JSX.Element => (
  <article
    className="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
    onClick={handlePostClick}
  >
    <PostCardArticleBody
      post={post}
      isImageExpanded={isImageExpanded}
      handleImageClick={handleImageClick}
    />
    <PostCardArticleActions
      post={post}
      handleLikeClick={handleLikeClick}
      handleCommentClick={handleCommentClick}
      handleShareClick={handleShareClick}
    />
  </article>
);

/**
 * 投稿カードの本文表示部
 * @param {PostCardArticleBodyProps} props
 * @returns {JSX.Element} 本文要素
 */
interface PostCardArticleBodyProps {
  post: PostWithUserActions;
  isImageExpanded: boolean;
  handleImageClick: (e: React.MouseEvent) => void;
}

/**
 * 投稿カードの本文表示部
 * @param {PostCardArticleBodyProps} props
 * @returns {JSX.Element} 本文要素
 */
/**
 * 投稿カードの本文表示部コンポーネント
 * @param props 本文表示プロパティ
 * @param props.post
 * @param props.isImageExpanded
 * @param props.handleImageClick
 * @returns {JSX.Element} 本文要素
 */
const PostCardArticleBody = ({
  post,
  isImageExpanded,
  handleImageClick,
}: PostCardArticleBodyProps): JSX.Element => (
  <PostCardBody post={post} isImageExpanded={isImageExpanded} handleImageClick={handleImageClick} />
);

/**
 * 投稿カードの本文（テキスト・画像）
 * @param {PostCardBodyProps} props
 * @returns {JSX.Element} 本文要素
 */
interface PostCardBodyProps {
  post: PostWithUserActions;
  isImageExpanded: boolean;
  handleImageClick: (e: React.MouseEvent) => void;
}

/**
 * 投稿カードの本文（テキスト・画像）
 * @param {PostCardBodyProps} props
 * @returns {JSX.Element} 本文要素
 */
/**
 * 投稿カードの本文（テキスト・画像）コンポーネント
 * @param props 本文プロパティ
 * @param props.post
 * @param props.isImageExpanded
 * @param props.handleImageClick
 * @returns {JSX.Element} 本文要素
 */
const PostCardBody = ({
  post,
  isImageExpanded,
  handleImageClick,
}: PostCardBodyProps): JSX.Element => {
  const { content, imageUrls } = post;
  return (
    <div>
      <div className="mb-2 text-gray-800 text-base whitespace-pre-line break-words">{content}</div>
      {imageUrls && imageUrls.length > 0 && (
        <PostCardBodyImage
          imageUrl={imageUrls[0] as string}
          isImageExpanded={isImageExpanded}
          handleImageClick={handleImageClick}
        />
      )}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>♥ {post.likes}</span>
        <span>💬 {post.commentCount}</span>
      </div>
    </div>
  );
};

/**
 * 投稿カードの画像表示（分割用）
 * @param {string} imageUrl
 * @param {boolean} isImageExpanded
 * @param {Function} handleImageClick
 * @returns {JSX.Element}
 */
const PostCardBodyImage = ({
  imageUrl,
  isImageExpanded,
  handleImageClick,
}: {
  imageUrl: string;
  isImageExpanded: boolean;
  handleImageClick: (e: React.MouseEvent) => void;
}): JSX.Element => (
  <div className="mt-2">
    <img
      src={imageUrl}
      alt="投稿画像"
      className={isImageExpanded ? 'w-full h-auto object-contain' : 'w-full h-48 object-cover'}
      onClick={handleImageClick}
      style={{ cursor: 'pointer' }}
    />
  </div>
);

/**
 * 投稿カードのアクション部（いいね・コメント・シェア）
 * @param {object} props
 * @param {PostWithUserActions} props.post - 投稿データ
 * @param {Function} props.handleLikeClick - いいねハンドラ
 * @param {Function} props.handleCommentClick - コメントハンドラ
 * @param {Function} props.handleShareClick - シェアハンドラ
 * @returns {JSX.Element} アクション要素
 */
/**
 * 投稿カードのアクション部（いいね・コメント・シェア）コンポーネント
 * @param props アクションプロパティ
 * @param props.post
 * @param props.handleLikeClick
 * @param props.handleCommentClick
 * @param props.handleShareClick
 * @returns {JSX.Element} アクション要素
 */
const PostCardArticleActions = ({
  post,
  handleLikeClick,
  handleCommentClick,
  handleShareClick,
}: {
  post: PostWithUserActions;
  handleLikeClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleCommentClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleShareClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
}): JSX.Element => (
  <PostCardActions
    isLiked={post.isLiked}
    handleLikeClick={handleLikeClick}
    handleCommentClick={handleCommentClick}
    handleShareClick={handleShareClick}
  />
);

/**
 * 投稿カードの画像表示部
 * @param {object} props
 * @param {string} props.imageUrl - 画像URL
 * @param {boolean} props.isImageExpanded - 画像拡大状態
 * @param {Function} props.handleImageClick - 画像クリックハンドラ
 * @param {number} props.extraCount - 追加枚数
 * @param {boolean} props.showExtra - 追加枚数表示フラグ
 * @returns {JSX.Element} 画像要素
 */

/**
 * 画像の追加枚数バッジ
 * @param {object} props
 * @param {boolean} props.showExtra - 追加枚数表示フラグ
 * @param {number} props.extraCount - 追加枚数
 * @returns {JSX.Element|null}
 */

/**
 * いいね数表示
 * @param {object} props
 * @param {number} props.likes - いいね数
 * @returns {JSX.Element} いいね数要素
 */

/**
 * 投稿カードのメニュー（オプション）
 * @returns {JSX.Element} メニュー要素
 */

/**
 *
 * @param root0
 * @param root0.isLiked
 * @param root0.handleLikeClick
 * @param root0.handleCommentClick
 * @param root0.handleShareClick
 */
/**
 * 投稿カードのアクションボタン群コンポーネント
 * @param props アクションボタン群プロパティ
 * @param props.isLiked
 * @param props.handleLikeClick
 * @param props.handleCommentClick
 * @param props.handleShareClick
 * @returns {JSX.Element} アクションボタン群要素
 */
const PostCardActions = ({
  isLiked,
  handleLikeClick,
  handleCommentClick,
  handleShareClick,
}: {
  isLiked: boolean;
  handleLikeClick: (e: React.MouseEvent) => void;
  handleCommentClick: (e: React.MouseEvent) => void;
  handleShareClick: (e: React.MouseEvent) => void;
}): JSX.Element => (
  <div className="flex border-t border-gray-100 pt-3">
    <PostCardLikeButton active={isLiked} onClick={handleLikeClick} />
    <PostCardCommentButton onClick={handleCommentClick} />
    <PostCardShareButton onClick={handleShareClick} />
  </div>
);

/**
 * いいねボタン
 * @param {object} props
 * @param {boolean} props.active - いいね状態
 * @param {Function} props.onClick - クリックハンドラ
 * @returns {JSX.Element} いいねボタン要素
 */
/**
 * 投稿カードの「いいね」ボタンコンポーネント
 * @param props ボタンプロパティ
 * @param props.active
 * @param props.onClick
 * @returns {JSX.Element} いいねボタン要素
 */
const PostCardLikeButton = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}): JSX.Element => (
  <PostCardActionButton
    active={active}
    onClick={onClick}
    icon={active ? '❤️' : '🤍'}
    label="いいね"
  />
);

/**
 * コメントボタン
 * @param {object} props
 * @param {Function} props.onClick - クリックハンドラ
 * @returns {JSX.Element} コメントボタン要素
 */
/**
 * 投稿カードの「コメント」ボタンコンポーネント
 * @param props ボタンプロパティ
 * @param props.onClick
 * @returns {JSX.Element} コメントボタン要素
 */
const PostCardCommentButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}): JSX.Element => (
  <PostCardActionButton active={false} onClick={onClick} icon="💬" label="コメント" />
);

/**
 * シェアボタン
 * @param {object} props
 * @param {Function} props.onClick - クリックハンドラ
 * @returns {JSX.Element} シェアボタン要素
 */
/**
 * 投稿カードの「シェア」ボタンコンポーネント
 * @param props ボタンプロパティ
 * @param props.onClick
 * @returns {JSX.Element} シェアボタン要素
 */
const PostCardShareButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}): JSX.Element => (
  <PostCardActionButton active={false} onClick={onClick} icon="🔄" label="シェア" />
);

/**
 * アクションボタン
 * @param {object} props
 * @param {boolean} props.active - アクティブ状態
 * @param {Function} props.onClick - クリックハンドラ
 * @param {string} props.icon - アイコン
 * @param {string} props.label - ラベル
 * @returns {JSX.Element} アクションボタン要素
 */
/**
 * 投稿カードのアクションボタンコンポーネント
 * @param props アクションボタンプロパティ
 * @param props.active
 * @param props.onClick
 * @param props.icon
 * @param props.label
 * @returns {JSX.Element} アクションボタン要素
 */
const PostCardActionButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  icon: string;
  label: string;
}): JSX.Element => (
  <button
    className={`flex-1 flex items-center justify-center py-1 ${active ? 'text-pink-500' : 'text-gray-500'} hover:bg-gray-50 rounded-md`}
    onClick={onClick}
  >
    <span className="mr-1">{icon}</span>
    <span>{label}</span>
  </button>
);

export default PostCard;
