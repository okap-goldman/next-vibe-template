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
 * @param post
 * @param onLikeClick
 * @param onCommentClick
 * @param onShareClick
 * @param onPostClick
 */
const usePostCardHandlers = (
  post: PostWithUserActions,
  onLikeClick?: (id: string) => void,
  onCommentClick?: (id: string) => void,
  onShareClick?: (id: string) => void,
  onPostClick?: (id: string) => void,
) => {
  const [isImageExpanded, setIsImageExpanded] = useState<boolean>(false);
  /**
   *
   */
  const handleLikeClick = () => onLikeClick?.(post.id);
  /**
   *
   */
  const handleCommentClick = () => onCommentClick?.(post.id);
  /**
   *
   */
  const handleShareClick = () => onShareClick?.(post.id);
  /**
   *
   */
  const handlePostClick = () => onPostClick?.(post.id);
  /**
   *
   * @param e
   */
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageExpanded((v) => !v);
  };
  return {
    isImageExpanded,
    handleLikeClick,
    handleCommentClick,
    handleShareClick,
    handlePostClick,
    handleImageClick,
    setIsImageExpanded,
  };
};

/**
 * 投稿カードコンポーネント
 * @param {PostCardProps} props
 * @returns {JSX.Element}
 */
export const PostCard = ({
  post,
  onLikeClick,
  onCommentClick,
  onShareClick,
  onPostClick,
}: PostCardProps): JSX.Element => {
  const {
    isImageExpanded,
    handleLikeClick,
    handleCommentClick,
    handleShareClick,
    handlePostClick,
    handleImageClick,
  } = usePostCardHandlers(post, onLikeClick, onCommentClick, onShareClick, onPostClick);
  return (
    <PostCardMainLayout
      post={post}
      isImageExpanded={isImageExpanded}
      handleLikeClick={handleLikeClick}
      handleCommentClick={handleCommentClick}
      handleShareClick={handleShareClick}
      handlePostClick={handlePostClick}
      handleImageClick={handleImageClick}
    />
  );
};

/**
 * 投稿カードのレイアウト本体（10行以内）
 */
interface PostCardMainLayoutProps {
  post: PostWithUserActions;
  isImageExpanded: boolean;
  handleLikeClick: () => void;
  handleCommentClick: () => void;
  handleShareClick: () => void;
  handlePostClick: () => void;
  handleImageClick: (e: React.MouseEvent) => void;
}

/**
 *
 * @param root0
 * @param root0.post
 * @param root0.isImageExpanded
 * @param root0.handleLikeClick
 * @param root0.handleCommentClick
 * @param root0.handleShareClick
 * @param root0.handlePostClick
 * @param root0.handleImageClick
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
    <PostCardBody
      post={post}
      isImageExpanded={isImageExpanded}
      handleImageClick={handleImageClick}
    />
    <PostCardActions
      isLiked={post.isLiked}
      handleLikeClick={handleLikeClick}
      handleCommentClick={handleCommentClick}
      handleShareClick={handleShareClick}
    />
  </article>
);

/**
 * 本文（ヘッダー・テキスト・画像・統計）
 */
interface PostCardBodyProps {
  post: PostWithUserActions;
  isImageExpanded: boolean;
  handleImageClick: (e: React.MouseEvent) => void;
}

/**
 *
 * @param root0
 * @param root0.post
 * @param root0.isImageExpanded
 * @param root0.handleImageClick
 */
const PostCardBody = ({
  post,
  isImageExpanded,
  handleImageClick,
}: PostCardBodyProps): JSX.Element => (
  <>
    <PostCardBodyHeader authorName={post.authorName} createdAt={post.createdAt} />
    <PostCardBodyContent content={post.content} />
    <PostCardBodyImage
      imageUrls={post.imageUrls}
      isImageExpanded={isImageExpanded}
      handleImageClick={handleImageClick}
    />
    <PostCardBodyStats likes={post.likes} commentCount={post.commentCount} />
  </>
);

/**
 *
 * @param root0
 * @param root0.authorName
 * @param root0.createdAt
 */
const PostCardBodyHeader = ({ authorName, createdAt }: { authorName: string; createdAt: string }) => (
  <div className="flex justify-between items-start mb-3">
    <PostCardAvatar authorName={authorName} />
    <PostCardCreatedAt createdAt={createdAt} />
    <PostCardMenu />
  </div>
);

/**
 *
 * @param root0
 * @param root0.content
 */
const PostCardBodyContent = ({ content }: { content: string }) => (
  <div className="mb-4">
    <p className="text-gray-800 whitespace-pre-line">{content}</p>
  </div>
);

/**
 *
 * @param root0
 * @param root0.imageUrls
 * @param root0.isImageExpanded
 * @param root0.handleImageClick
 */
const PostCardBodyImage = ({
  imageUrls,
  isImageExpanded,
  handleImageClick,
}: {
  imageUrls?: string[];
  isImageExpanded: boolean;
  handleImageClick: (e: React.MouseEvent) => void;
}) => {
  if (!imageUrls || imageUrls.length === 0) return null;
  return (
    <div className="mb-4">
      <PostCardImageInner
        imageUrl={imageUrls[0] ?? ''}
        isImageExpanded={isImageExpanded}
        handleImageClick={handleImageClick}
        extraCount={imageUrls.length - 1}
        showExtra={!isImageExpanded && imageUrls.length > 1}
      />
    </div>
  );
};

/**
 *
 * @param root0
 * @param root0.likes
 * @param root0.commentCount
 */
const PostCardBodyStats = ({ likes, commentCount }: { likes: number; commentCount: number }) => (
  <div className="flex justify-between text-xs text-gray-500 mb-3">
    <PostCardLikeCount likes={likes} />
    <PostCardCommentCount commentCount={commentCount} />
  </div>
);

/**
 *
 * @param root0
 * @param root0.likes
 */
const PostCardLikeCount = ({ likes }: { likes: number }) => (
  <div>{likes > 0 ? `${likes}件のいいね` : ''}</div>
);
/**
 *
 * @param root0
 * @param root0.commentCount
 */
const PostCardCommentCount = ({ commentCount }: { commentCount: number }) => (
  <div>{commentCount > 0 ? `コメント${commentCount}件` : ''}</div>
);

/**
 * 投稿カードのヘッダー部
 * @param props.authorName - 投稿者名
 * @param props.createdAt - 投稿日時
 */
interface PostCardHeaderProps {
  authorName: string;
  createdAt: string;
}

/**
 *
 * @param root0
 * @param root0.authorName
 * @param root0.createdAt
 */
const PostCardHeader = ({ authorName, createdAt }: PostCardHeaderProps): JSX.Element => (
  <div className="flex justify-between items-start mb-3">
    <PostCardAvatar authorName={authorName} />
    <PostCardMenu />
    <PostCardCreatedAt createdAt={createdAt} />
  </div>
);

/**
 *
 * @param root0
 * @param root0.authorName
 */
const PostCardAvatar = ({ authorName }: { authorName: string }): JSX.Element => (
  <div className="flex items-center">
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
      <span className="text-gray-500 text-sm">{authorName.charAt(0).toUpperCase()}</span>
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">{authorName}</h3>
    </div>
  </div>
);

/**
 *
 * @param root0
 * @param root0.createdAt
 */
const PostCardCreatedAt = ({ createdAt }: { createdAt: string }): JSX.Element => (
  <p className="text-xs text-gray-500">{timeAgo(createdAt)}</p>
);

/**
 *
 */
const PostCardMenu = (): JSX.Element => (
  <button className="text-gray-400 hover:text-gray-600">
    <span>⋯</span>
  </button>
);


/**
 * 投稿本文表示部
 * @param props.content - 投稿テキスト
 * @param root0
 * @param root0.content
 */
const PostCardContent = ({ content }: { content: string }): JSX.Element => (
  <div className="mb-4">
    <p className="text-gray-800 whitespace-pre-line">{content}</p>
  </div>
);

/**
 * 投稿画像表示部
 * @param props.imageUrls - 画像URL配列
 * @param props.isImageExpanded - 拡大表示フラグ
 * @param props.handleImageClick - 画像クリックハンドラ
 */
/**
 * 投稿画像表示部
 * @param root0
 * @param root0.imageUrls
 * @param root0.isImageExpanded
 * @param root0.handleImageClick
 */
const PostCardImage = ({
  imageUrls,
  isImageExpanded,
  handleImageClick,
}: {
  imageUrls?: string[];
  isImageExpanded: boolean;
  handleImageClick: (e: React.MouseEvent) => void;
}): JSX.Element | null => {
  if (!imageUrls || imageUrls.length === 0) return null;
  return (
    <div className="mb-4">
      <PostCardImageInner
        imageUrl={imageUrls[0] ?? ''}
        isImageExpanded={isImageExpanded}
        handleImageClick={handleImageClick}
        extraCount={imageUrls.length - 1}
        showExtra={!isImageExpanded && imageUrls.length > 1}
      />
    </div>
  );
};

/**
 *
 * @param root0
 * @param root0.imageUrl
 * @param root0.isImageExpanded
 * @param root0.handleImageClick
 * @param root0.extraCount
 * @param root0.showExtra
 */
const PostCardImageInner = ({
  imageUrl,
  isImageExpanded,
  handleImageClick,
  extraCount,
  showExtra,
}: {
  imageUrl: string;
  isImageExpanded: boolean;
  handleImageClick: (e: React.MouseEvent) => void;
  extraCount: number;
  showExtra: boolean;
}): JSX.Element => (
  <div
    className={`relative rounded-lg overflow-hidden cursor-zoom-in ${
      isImageExpanded
        ? 'fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4'
        : ''
    }`}
    onClick={handleImageClick}
  >
    <PostCardImageMain imageUrl={imageUrl} isImageExpanded={isImageExpanded} />
    <PostCardImageBadge showExtra={showExtra} extraCount={extraCount} />
  </div>
);

/**
 *
 * @param root0
 * @param root0.imageUrl
 * @param root0.isImageExpanded
 */
const PostCardImageMain = ({ imageUrl, isImageExpanded }: { imageUrl: string; isImageExpanded: boolean }) => (
  <Image
    src={imageUrl}
    alt="投稿画像"
    fill
    className={
      isImageExpanded
        ? 'max-h-screen max-w-full object-contain'
        : 'w-full h-auto object-cover'
    }
  />
);

/**
 *
 * @param root0
 * @param root0.showExtra
 * @param root0.extraCount
 */
const PostCardImageBadge = ({ showExtra, extraCount }: { showExtra: boolean; extraCount: number }) =>
  showExtra ? (
    <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
      +{extraCount}
    </div>
  ) : null;

/**
 *
 * @param root0
 * @param root0.isLiked
 * @param root0.handleLikeClick
 * @param root0.handleCommentClick
 * @param root0.handleShareClick
 */
const PostCardActions = ({
  isLiked,
  handleLikeClick,
  handleCommentClick,
  handleShareClick,
}: {
  isLiked: boolean;
  handleLikeClick: () => void;
  handleCommentClick: () => void;
  handleShareClick: () => void;
}): JSX.Element => (
  <div className="flex border-t border-gray-100 pt-3">
    <PostCardLikeButton active={isLiked} onClick={handleLikeClick} />
    <PostCardCommentButton onClick={handleCommentClick} />
    <PostCardShareButton onClick={handleShareClick} />
  </div>
);

/**
 *
 * @param root0
 * @param root0.active
 * @param root0.onClick
 */
const PostCardLikeButton = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <PostCardActionButton
    active={active}
    onClick={onClick}
    icon={active ? '❤️' : '🤍'}
    label="いいね"
  />
);

/**
 *
 * @param root0
 * @param root0.onClick
 */
const PostCardCommentButton = ({ onClick }: { onClick: () => void }) => (
  <PostCardActionButton active={false} onClick={onClick} icon="💬" label="コメント" />
);

/**
 *
 * @param root0
 * @param root0.onClick
 */
const PostCardShareButton = ({ onClick }: { onClick: () => void }) => (
  <PostCardActionButton active={false} onClick={onClick} icon="🔄" label="シェア" />
);

/**
 *
 * @param root0
 * @param root0.active
 * @param root0.onClick
 * @param root0.icon
 * @param root0.label
 */
const PostCardActionButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
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
