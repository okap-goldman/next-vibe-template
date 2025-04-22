/**
 * 共通ユーティリティ関数
 * アプリケーション全体で使用される汎用的なユーティリティ関数
 */

// ここに共通ユーティリティ関数をエクスポート
// es-toolkitからのユーティリティ関数の再エクスポート例
// export { chunk, groupBy, uniq } from 'es-toolkit';

/**
 * オブジェクト配列から重複を削除する
 * @param {T[]} array - 処理する配列
 * @param {keyof T} key - 重複判定に使用するプロパティ名
 * @returns {T[]} 重複を削除した配列
 */
export const removeDuplicatesByKey = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * 指定されたミリ秒だけ処理を遅延させる
 * @param {number} ms - 待機するミリ秒数
 * @returns {Promise<void>} 指定時間後に解決するPromise
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * オブジェクトから指定したキーを持つ新しいオブジェクトを作成
 * @param {Record<string, any>} obj - 元のオブジェクト
 * @param {string[]} keys - 抽出するキーの配列
 * @returns {Record<string, any>} 指定されたキーのみを持つ新しいオブジェクト
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};
