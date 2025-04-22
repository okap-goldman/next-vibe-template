/**
 * データフェッチユーティリティ
 * API呼び出しを一貫した方法で行うためのラッパー
 */

/**
 * HTTPリクエストに使用するオプション
 */
export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * APIレスポンスの基本形式
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * クエリパラメータをURLに追加する関数
 * @param {string} url - ベースURL
 * @param {Record<string, string | number | boolean | undefined>} params - クエリパラメータ
 * @returns {string} クエリパラメータ付きのURL
 */
const addQueryParams = (
  url: string,
  params?: Record<string, string | number | boolean | undefined>,
): string => {
  if (!params) return url;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  if (queryString) {
    return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
  }

  return url;
};

/**
 * 汎用的なフェッチ関数
 * @param {string} url - フェッチ対象のURL
 * @param {FetchOptions} options - フェッチオプション
 * @returns {Promise<ApiResponse<T>>} レスポンスデータを含むPromise
 */
export const fetcher = async <T>(url: string, options?: FetchOptions): Promise<ApiResponse<T>> => {
  try {
    const { params, ...fetchOptions } = options || {};
    const targetUrl = addQueryParams(url, params);

    const response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
      ...fetchOptions,
    });

    // JSONデータの取得を試みる
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    // 成功時のレスポンス
    if (response.ok) {
      return {
        data: data as T,
        status: response.status,
      };
    }

    // エラー時のレスポンス
    return {
      error: data?.message || response.statusText,
      status: response.status,
    };
  } catch (error) {
    // ネットワークエラーなどの例外
    return {
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      status: 0,
    };
  }
};

/**
 * GETリクエストを実行する関数
 * @param {string} url - GETリクエスト対象のURL
 * @param {FetchOptions} options - フェッチオプション
 * @returns {Promise<ApiResponse<T>>} レスポンスデータを含むPromise
 */
export const get = <T>(url: string, options?: FetchOptions): Promise<ApiResponse<T>> => {
  return fetcher<T>(url, {
    method: 'GET',
    ...options,
  });
};

/**
 * POSTリクエストを実行する関数
 * @param {string} url - POSTリクエスト対象のURL
 * @param {unknown} data - POSTするデータ
 * @param {FetchOptions} options - フェッチオプション
 * @returns {Promise<ApiResponse<T>>} レスポンスデータを含むPromise
 */
export const post = <T>(
  url: string,
  data?: unknown,
  options?: FetchOptions,
): Promise<ApiResponse<T>> => {
  return fetcher<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : null,
    ...options,
  });
};

/**
 * PUTリクエストを実行する関数
 * @param {string} url - PUTリクエスト対象のURL
 * @param {unknown} data - PUTするデータ
 * @param {FetchOptions} options - フェッチオプション
 * @returns {Promise<ApiResponse<T>>} レスポンスデータを含むPromise
 */
export const put = <T>(
  url: string,
  data?: unknown,
  options?: FetchOptions,
): Promise<ApiResponse<T>> => {
  return fetcher<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : null,
    ...options,
  });
};

/**
 * DELETEリクエストを実行する関数
 * @param {string} url - DELETEリクエスト対象のURL
 * @param {FetchOptions} options - フェッチオプション
 * @returns {Promise<ApiResponse<T>>} レスポンスデータを含むPromise
 */
export const del = <T>(url: string, options?: FetchOptions): Promise<ApiResponse<T>> => {
  return fetcher<T>(url, {
    method: 'DELETE',
    ...options,
  });
};
