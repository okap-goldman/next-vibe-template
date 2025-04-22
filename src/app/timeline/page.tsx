/**
 * タイムラインページのコンポーネント (`/timeline`)
 * 関連する feature コンポーネントを呼び出し、データを渡す責務を持つ
 */
import type { JSX } from 'react';
// import { Feed } from '@/src/features/timeline'; // 仮
// import { getInitialFeed } from '@/src/features/timeline/server'; // 仮

/**
 * タイムラインページ (Server Component)
 * @returns {Promise<JSX.Element>} タイムラインページの要素
 */
const TimelinePage = async (): Promise<JSX.Element> => {
  // const initialFeed = await getInitialFeed({ limit: 10 }); // データ取得はfeatureに委譲

  return (
    <div>
      <h2>Timeline Page</h2>
      {/* <Feed initialData={initialFeed} /> */}
      <p>Timeline content will be displayed here.</p>
    </div>
  );
};

export default TimelinePage;
