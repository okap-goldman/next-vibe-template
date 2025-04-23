/**
 * 単一の投稿データを管理するフック
 * 投稿の取得・いいね・保存などの操作を提供
 */
import { useCallback, useEffect, useState } from 'react';

import { get, post } from '../../../libs/fetcher';
import type { PostWithUserActions, UsePostOptions, UsePostResult } from '../types';

/**
 * 単一の投稿を取得・操作するカスタムフック
 * @param {UsePostOptions} options - フックのオプション
 * @param {string} options.postId - 取得する投稿のID
 * @param {Post} [options.initialData] - 初期データ（SSRなどで事前取得した場合）
 * @param id
 * @returns {UsePostResult} 投稿データと操作関数
 */
// 投稿データ取得ロジック
const fetchPostData = async (id: string): Promise<PostWithUserActions> => {
  const response = await get<{ post: PostWithUserActions }>(`/api/posts/${id}`);
  if (response.error) throw new Error(response.error);
  if (response.data?.post) return response.data.post;
  throw new Error('投稿データが見つかりません');
};

// 投稿取得
/**
 * 投稿データ取得用カスタムフック。
 *
 * @param postId - 投稿ID
 * @param setPostData - 投稿データsetter
 * @param setIsLoading - ローディング状態setter
 * @param setIsError - エラー状態setter
 * @param setError - エラー内容setter
 * @returns 投稿取得関数
 */
const useFetchPost = (
  postId: string | undefined,
  setPostData: (p: PostWithUserActions) => void,
  setIsLoading: (b: boolean) => void,
  setIsError: (b: boolean) => void,
  setError: (e: Error | null) => void,
) =>
  useCallback(async (): Promise<void> => {
    if (!postId) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const post = await fetchPostData(postId);
      setPostData(post);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('投稿の取得に失敗しました'));
      console.error('投稿取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, setPostData, setIsLoading, setIsError, setError]);

// いいね
/**
 * 投稿に「いいね」するためのカスタムフック。
 * @param postData - 投稿データ
 * @param setPostData - 投稿データのsetter
 * @param postId - 投稿ID
 * @returns いいね実行関数
 */
const useLikePost = (
  postData: PostWithUserActions | null,
  setPostData: React.Dispatch<React.SetStateAction<PostWithUserActions | null>>,
  postId: string | undefined,
) =>
  useCallback(async (): Promise<void> => {
    if (!postData || postData.isLiked) return;
    try {
      setPostData((prev) => (prev ? { ...prev, isLiked: true, likes: prev.likes + 1 } : null));
      const response = await post<{ success: boolean }>(`/api/posts/${postId}/like`);
      if (response.error) {
        setPostData((prev) => (prev ? { ...prev, isLiked: false, likes: prev.likes - 1 } : null));
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('いいね処理エラー:', err);
    }
  }, [postData, postId]);

// いいね取り消し
/**
 * 投稿に「いいね」するためのカスタムフック。
 * @param postData - 投稿データ
 * @param setPostData - 投稿データのsetter
 * @param postId - 投稿ID
 * @returns いいね実行関数
 */
const useUnlikePost = (
  postData: PostWithUserActions | null,
  setPostData: React.Dispatch<React.SetStateAction<PostWithUserActions | null>>,
  postId: string | undefined,
) =>
  useCallback(async (): Promise<void> => {
    if (!postData || !postData.isLiked) return;
    try {
      setPostData((prev) => (prev ? { ...prev, isLiked: false, likes: prev.likes - 1 } : null));
      const response = await post<{ success: boolean }>(`/api/posts/${postId}/unlike`);
      if (response.error) {
        setPostData((prev) => (prev ? { ...prev, isLiked: true, likes: prev.likes + 1 } : null));
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('いいね取り消しエラー:', err);
    }
  }, [postData, postId]);

/**
 * 投稿データ管理用カスタムフック。
 *
 * @param options - 投稿管理オプション
 * @returns 投稿管理結果
 */
export const usePost = (options: UsePostOptions): UsePostResult => {
  const { postId, initialData } = options;
  const [postData, setPostData] = useState<PostWithUserActions | null>(
    initialData ? { ...initialData, isLiked: false, isSaved: false } : null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPost = useFetchPost(postId, setPostData, setIsLoading, setIsError, setError);
  const likePost = useLikePost(postData, setPostData, postId);
  const unlikePost = useUnlikePost(postData, setPostData, postId);

  useEffect(() => {
    if (!initialData) {
      void fetchPost();
    }
  }, [fetchPost, initialData]);

  return {
    post: postData,
    isLoading,
    isError,
    error,
    refetch: fetchPost,
    likePost,
    unlikePost,
  };
};
