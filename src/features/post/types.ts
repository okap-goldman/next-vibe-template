/**
 * 投稿機能の型定義
 * 投稿の作成、取得、操作に関する型を定義
 */

/**
 * 投稿の基本情報
 */
export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string | null;
  imageUrls: string[];
  likes: number;
  commentCount: number;
}

/**
 * クライアント表示用の投稿情報（いいね状態などの追加情報を含む）
 */
export interface PostWithUserActions extends Post {
  isLiked: boolean;
  isSaved: boolean;
}

/**
 * 新しい投稿作成時のデータ
 */
export interface CreatePostData {
  content: string;
  imageUrls?: string[];
}

/**
 * 投稿編集時のデータ
 */
export interface UpdatePostData {
  id: string;
  content?: string;
  imageUrls?: string[];
}

/**
 * 投稿APIのレスポンス型
 */
export interface PostApiResponse {
  post: Post;
  success: boolean;
  message?: string;
}

/**
 * 投稿一覧取得APIのレスポンス型
 */
export interface PostListApiResponse {
  posts: PostWithUserActions[];
  totalCount: number;
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * usePostフックのオプション
 */
export interface UsePostOptions {
  postId: string;
  initialData?: Post;
}

/**
 * usePostフックの戻り値
 */
export interface UsePostResult {
  post: PostWithUserActions | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  likePost: () => Promise<void>;
  unlikePost: () => Promise<void>;
}
