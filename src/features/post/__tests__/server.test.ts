import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { db } from '../../../db/client';
console.warn('db instance:', db);
import { createPost, deletePost, getPostsByProfile } from '../server';

let profileId: number;
let postId: number;

beforeAll(async () => {
  // テスト用Profile作成
  const profile = await db.profile.create({ data: { name: 'Vitestユーザー' } });
  console.warn('profile create result:', profile);
  profileId = profile.id;
});

afterAll(async () => {
  // クリーンアップ
  await db.profile.delete({ where: { id: profileId } });
  await db.$disconnect();
});

describe('PostモデルCRUD', () => {
  it('Post作成・取得・削除ができる', async () => {
    // 作成
    const post = await createPost(profileId, 'Vitest投稿');
    postId = post.id;
    expect(post.content).toBe('Vitest投稿');

    // 取得
    const posts = await getPostsByProfile(profileId);
    expect(posts.length).toBeGreaterThan(0);

    // 削除
    await deletePost(postId);
    const postsAfterDelete = await getPostsByProfile(profileId);
    expect(postsAfterDelete.find((p: { id: number }) => p.id === postId)).toBeUndefined();
  });
});
