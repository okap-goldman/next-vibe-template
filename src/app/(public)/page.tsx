/**
 * 公開ホームページ（またはランディングページ）
 * ルートURL ("/") に対応するページコンポーネント
 */
import type { JSX } from 'react';

/**
 * ホームページコンポーネント
 * @returns {JSX.Element} ホームページの要素
 */
const HomePage = (): JSX.Element => {
  return (
    <main>
      <h1>Welcome to Next Vibe Template</h1>
      <p>This is the public home page.</p>
    </main>
  );
};

export default HomePage;
