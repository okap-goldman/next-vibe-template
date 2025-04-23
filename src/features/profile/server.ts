import { db } from '../../db/client';

/**
 * 指定IDのプロフィールを取得します。
 * @param id プロフィールID
 * @returns プロフィールデータ
 */
export async function getProfileById(id: number) {
  return db.profile.findUnique({ where: { id } });
}
