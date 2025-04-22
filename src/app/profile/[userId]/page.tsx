/**
 * ユーザープロフィールページのコンポーネント (`/profile/[userId]`)
 * 動的セグメント `[userId]` を受け取り、対応するユーザーのプロフィールを表示
 */
import type { JSX } from 'react';
// import { UserProfile } from '@/src/features/profile'; // 仮
// import { getUserProfile } from '@/src/features/profile/server'; // 仮

/**
 * ユーザープロフィールページのコンポーネント
 * @param {object} props - Next.jsのページプロパティ
 * @param {object} props.params - URLパラメータ
 * @param {string} props.params.userId - ユーザーID
 * @returns {Promise<JSX.Element>} プロフィールページの要素
 */
const ProfilePage = async (props: {
  params: Promise<{ userId: string }>;
}): Promise<JSX.Element> => {
  const { userId } = await props.params;

  // const userProfile = await getUserProfile(userId); // データ取得はfeatureに委譲

  return (
    <div>
      <h2>User Profile: {userId}</h2>
      {/* <UserProfile profile={userProfile} /> */}
      <p>User profile content will be displayed here.</p>
    </div>
  );
};

export default ProfilePage;
