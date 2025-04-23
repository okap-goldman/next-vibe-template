import { db } from '../../db/client';

// Post作成
/**
 * 新しい投稿を作成します。
 * @param profileId プロフィールID
 * @param title タイトル
 * @param content 内容
 * @returns 作成された投稿
 */
export async function createPost(profileId: number, content: string) {
  return db.post.create({
    data: { profileId, content },
  });
}

// Post取得（既存）
/**
 * 指定したプロフィールIDの投稿を取得します。
 * @param profileId プロフィールID
 * @returns 投稿配列
 */
export async function getPostsByProfile(profileId: number) {
  return db.post.findMany({
    where: { profileId },
    orderBy: { createdAt: 'desc' },
  });
}

// Post削除
/**
 * 指定した投稿を削除します。
 * @param postId 投稿ID
 * @returns 削除された投稿
 */
export async function deletePost(postId: number) {
  return db.post.delete({
    where: { id: postId },
  });
}
