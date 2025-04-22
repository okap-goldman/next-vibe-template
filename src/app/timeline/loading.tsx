/**
 * タイムラインページのローディング状態を示すUIコンポーネント
 * Next.js の Suspense フォールバックとして機能する
 */
import type { JSX } from 'react';

/**
 * タイムラインローディングコンポーネント
 * @returns {JSX.Element} ローディング中のUI要素
 */
const TimelineLoading = (): JSX.Element => {
  return (
    <div>
      <h2>Loading Timeline...</h2>
      {/* ここにスケルトンUIなどを配置 */}
      <p>Please wait while we load the timeline.</p>
    </div>
  );
};

export default TimelineLoading;
