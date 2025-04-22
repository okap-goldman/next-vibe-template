/**
 * アプリケーション全体のエラーバウンダリ
 * ルートセグメントで発生した未処理のエラーをキャッチし、カスタムUIを表示
 */
'use client'; // Error components must be Client Components
import type { JSX } from 'react';
import { useEffect } from 'react';

/**
 * グローバルエラーコンポーネント
 * @param {object} props - プロパティ
 * @param {Error & { digest?: string }} props.error - 発生したエラーオブジェクト
 * @param {() => void} props.reset - エラー境界をリセットし、再レンダリングを試みる関数
 * @returns {JSX.Element} エラー表示UI
 */
const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element => {
  useEffect(() => {
    // 例: エラーレポートサービスにエラーをログ記録する
    console.error(error);
  }, [error]);

  /**
   * 再試行ボタンのクリックハンドラ
   */
  const handleRetry = (): void => {
    reset();
  };

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={handleRetry}>Try again</button>
      </body>
    </html>
  );
};

export default GlobalError;
