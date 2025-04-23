/**
 * 日付操作ユーティリティ
 * アプリケーション全体で一貫した日付フォーマットと操作を提供
 */

/**
 * 日付を「YYYY年MM月DD日」形式にフォーマット
 * @param {string | Date} date - フォーマットする日付
 * @returns {string} フォーマットされた日付文字列
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${year}年${month}月${day}日`;
};

/**
 * 日付を相対時間（〇分前、〇時間前など）で表示
 * @param {string | Date} date - 相対表示する日付
 * @returns {string} 相対的な時間表現
 */
export const timeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const MONTH = 2592000;
  const YEAR = 31536000;

  if (diff < MINUTE) {
    return `${diff}秒前`;
  } else if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)}分前`;
  } else if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}時間前`;
  } else if (diff < MONTH) {
    return `${Math.floor(diff / DAY)}日前`;
  } else if (diff < YEAR) {
    return `${Math.floor(diff / MONTH)}ヶ月前`;
  } else {
    return `${Math.floor(diff / YEAR)}年前`;
  }
};

/**
 * 日付が今日かどうかを判定
 * @param {string | Date} date - 判定する日付
 * @returns {boolean} 今日の日付ならtrue
 */
export const isToday = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * ISO8601形式の日付文字列をYYYY-MM-DD形式に変換
 * @param {string} isoString - ISO8601形式の日付文字列
 * @returns {string} YYYY-MM-DD形式の日付文字列
 */
export const formatISODateToYYYYMMDD = (isoString: string): string => {
  const date = new Date(isoString);
  return date?.toISOString?.()?.split?.('T')[0] ?? '';
};
