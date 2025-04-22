/**
 * 単一の投稿データを管理するフック
 * 投稿の取得・いいね・保存などの操作を提供
 */
import { useCallback, useEffect, useState } from 'react';

import { get, post } from '../../../libs/fetcher';
import { PostWithUserActions, UsePostOptions, UsePostResult } from '../types';

/**
 * 単一の投稿を取得・操作するカスタムフック
 * @param {UsePostOptions} options - フックのオプション
 * @param {string} options.postId - 取得する投稿のID
 * @param {Post} [options.initialData] - 初期データ（SSRなどで事前取得した場合）
 * @returns {UsePostResult} 投稿データと操作関数
 */
export const usePost = (options: UsePostOptions): UsePostResult => {
  const { postId, initialData } = options;

  const [postData, setPostData] = useState<PostWithUserActions | null>(
    initialData ? { ...initialData, isLiked: false, isSaved: false } : null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 投稿を取得する関数
   */
  const fetchPost = useCallback(async (): Promise<void> => {
    if (!postId) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await get<{ post: PostWithUserActions }>(`/api/posts/${postId}`);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.post) {
        setPostData(response.data.post);
      } else {
        throw new Error('投稿データが見つかりません');
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('投稿の取得に失敗しました'));
      console.error('投稿取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // 初回マウント時に投稿データを取得
  useEffect(() => {
    if (!initialData) {
      void fetchPost();
    }
  }, [fetchPost, initialData]);

  /**
   * 投稿に「いいね」する関数
   */
  /**
   * 投稿に「いいね」する関数
   * @returns {Promise<void>} いいね処理の完了
   */
  const likePost = useCallback(async (): Promise<void> => {
    if (!postData || postData.isLiked) return;
    try {
      setPostData((prev: PostWithUserActions | null) =>
        prev ? { ...prev, isLiked: true, likes: prev.likes + 1 } : null,
      );
      const response = await post<{ success: boolean }>(`/api/posts/${postId}/like`);
      if (response.error) {
        setPostData((prev: PostWithUserActions | null) =>
          prev ? { ...prev, isLiked: false, likes: prev.likes - 1 } : null,
        );
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('いいね処理エラー:', err);
    }
  }, [postData, postId]);

  /**
   * 投稿の「いいね」を取り消す関数
   */
  /**
   * 投稿の「いいね」を取り消す関数
   * @returns {Promise<void>} 取り消し処理の完了
   */
  const unlikePost = useCallback(async (): Promise<void> => {
    if (!postData || !postData.isLiked) return;
    try {
      setPostData((prev: PostWithUserActions | null) =>
        prev ? { ...prev, isLiked: false, likes: prev.likes - 1 } : null,
      );
      const response = await post<{ success: boolean }>(`/api/posts/${postId}/unlike`);
      if (response.error) {
        setPostData((prev: PostWithUserActions | null) =>
          prev ? { ...prev, isLiked: true, likes: prev.likes + 1 } : null,
        );
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('いいね取り消しエラー:', err);
    }
  }, [postData, postId]);

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
