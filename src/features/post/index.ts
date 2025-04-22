/**
 * 投稿機能のエントリーポイント
 * 投稿機能の主要なコンポーネント、フック、型をエクスポート
 */

// 型定義のエクスポート
export * from './types';

// コンポーネントのエクスポート
export { PostCard } from './components/PostCard';
export { PostForm } from './components/PostForm';

// フックのエクスポート
// export { useCreatePost } from './hooks/useCreatePost';
export { usePost } from './hooks/usePost';
// export { usePostList } from './hooks/usePostList';

// APIエンドポイント情報（App Router形式）
// このファイルをインポートする側に、APIの存在を知らせるためのコメント
// /api/posts - 投稿一覧取得API
// /api/posts/[id] - 投稿詳細取得API
// /api/posts/create - 投稿作成API
// /api/posts/[id]/like - 投稿いいねAPI
