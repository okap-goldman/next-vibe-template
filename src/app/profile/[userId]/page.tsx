/**
 * ユーザープロフィールページのコンポーネント (`/profile/[userId]`)
 * 動的セグメント `[userId]` を受け取り、対応するユーザーのプロフィールを表示
 */
import type { JSX } from 'react';
// import { UserProfile } from '@/src/features/profile'; // 仮
// import { getUserProfile } from '@/src/features/profile/server'; // 仮

type ProfilePageProps = {
  params: { userId: string };
};

/**
 * プロフィールページ (Server Component)
 * @param {ProfilePageProps} props - プロパティ（URLパラメータを含む）
 * @returns {Promise<JSX.Element>} プロフィールページの要素
 */
const ProfilePage = async ({ params }: ProfilePageProps): Promise<JSX.Element> => {
  const { userId } = params;
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
